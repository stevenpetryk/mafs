import { Expr, FnName, walk } from "../../cas/expr"
import { Analysis, Feature } from "../../cas/analyze"
import { compile1 } from "../../cas/evaluate"
import { evaluateInterval } from "../../cas/interval"
import { vec } from "../../vec"
import { Box, PathBuilder, sampleParametric } from "./PlotUtils"

/** Period of each periodic (or step) function, for detecting aliasing. */
const PERIODS: Partial<Record<FnName, number>> = {
  sin: 2 * Math.PI,
  cos: 2 * Math.PI,
  sec: 2 * Math.PI,
  csc: 2 * Math.PI,
  tan: Math.PI,
  cot: Math.PI,
  floor: 1,
  ceil: 1,
  round: 1,
}

/**
 * When the argument of a periodic function sweeps through more than this many
 * periods within a single pixel column, sampling it is hopeless (you get
 * aliasing), so we draw the band of possible values instead.
 */
const ALIASING_PERIODS_PER_PIXEL = 0.15

/** Upper bound on pixel columns we check, so huge panes stay cheap. */
const MAX_COLUMNS = 4000

export interface ExpressionSample {
  /** SVG path for the curve itself, with breaks at discontinuities. */
  curve: string
  /** SVG path (filled) for regions too oscillatory to draw as a curve. */
  band: string
  /** Analysis features that are actually drawable (i.e. not hidden by a band). */
  features: Feature[]
}

export interface SampleExpressionOptions {
  expr: Expr
  analysis: Analysis
  domain: [number, number]
  /** Width of one pixel, in math units. */
  pixelWidth: number
  minDepth: number
  maxDepth: number
  threshold: number
  clip?: Box
  variable?: string
}

/**
 * Plot an expression using what the CAS knows about it:
 *
 * 1. Columns where the function oscillates faster than a pixel can show are
 *    drawn as a filled band, computed with interval arithmetic (so it's a
 *    guaranteed enclosure, not a guess).
 * 2. Everywhere else, the domain is split at every discontinuity the analysis
 *    found, and each continuous piece is sampled separately. Pieces next to a
 *    vertical asymptote are sampled right up to it, so the curve actually
 *    leaves the screen instead of stopping short or drawing a vertical line.
 */
export function sampleExpression({
  expr,
  analysis,
  domain: [A, B],
  pixelWidth,
  minDepth,
  maxDepth,
  threshold,
  clip,
  variable = "x",
}: SampleExpressionOptions): ExpressionSample {
  const f = compile1(expr, variable)
  const xy = (x: number): vec.Vector2 => [x, f(x)]

  const { regions, band } = findBands(expr, [A, B], pixelWidth, clip, variable)

  const inBand = (x: number) => regions.some(([l, r]) => x >= l && x <= r)
  const features = analysis.features.filter((feat) => feat.x >= A && feat.x <= B && !inBand(feat.x))

  // Split [A, B] minus the band regions at each feature.
  const cuts = new Set(features.filter((feat) => feat.kind !== "kink").map((feat) => feat.x))
  const kinks = new Set(features.filter((feat) => feat.kind === "kink").map((feat) => feat.x))
  const stops = [...new Set([A, B, ...cuts, ...kinks, ...regions.flat()])].sort((a, b) => a - b)

  const path = new PathBuilder(clip)
  const width = B - A
  for (let i = 0; i < stops.length - 1; i++) {
    let l = stops[i]
    let r = stops[i + 1]
    if (r <= l || inBand((l + r) / 2)) continue

    // Approach discontinuities without landing on them.
    const eps = (x: number) => Math.max(width * 1e-12, Math.abs(x) * 1e-14)
    if (cuts.has(l)) l += eps(l)
    if (cuts.has(r)) r -= eps(r)
    if (r <= l) continue

    // Keep the overall sampling density roughly what it would be for the
    // whole domain, so many small pieces don't each get the full treatment.
    const pieceMinDepth = Math.max(2, Math.round(minDepth - Math.log2(width / (r - l))))
    // Continue the stroke through kinks (they're continuous), break elsewhere.
    if (!kinks.has(stops[i])) path.break()
    sampleParametric(xy, [l, r], pieceMinDepth, maxDepth, threshold, clip, path)
  }

  return { curve: path.toString(), band, features }
}

function findBands(
  expr: Expr,
  [A, B]: [number, number],
  pixelWidth: number,
  clip: Box | undefined,
  variable: string,
): { regions: [number, number][]; band: string } {
  const periodic: { arg: Expr; period: number }[] = []
  walk(expr, (node) => {
    if (node.kind === "call" && PERIODS[node.fn])
      periodic.push({ arg: node.arg, period: PERIODS[node.fn]! })
  })
  if (periodic.length === 0 || !(pixelWidth > 0)) return { regions: [], band: "" }

  const columns = Math.min(MAX_COLUMNS, Math.ceil((B - A) / pixelWidth))
  const w = (B - A) / columns

  const aliased = (x0: number, x1: number) =>
    periodic.some(({ arg, period }) => {
      const iv = evaluateInterval(arg, [x0, x1], variable)
      return iv !== null && iv[1] - iv[0] >= period * ALIASING_PERIODS_PER_PIXEL
    })

  const yMin = clip?.yMin ?? -1e6
  const yMax = clip?.yMax ?? 1e6
  const regions: [number, number][] = []
  let band = ""
  let upper: string[] = []
  let lower: string[] = []
  const flush = () => {
    if (upper.length) band += `M ${upper.join(" L ")} L ${lower.reverse().join(" L ")} Z `
    upper = []
    lower = []
  }

  for (let i = 0; i < columns; i++) {
    const x0 = A + i * w
    const x1 = i === columns - 1 ? B : x0 + w
    if (!aliased(x0, x1)) {
      flush()
      continue
    }

    const last = regions[regions.length - 1]
    if (last && last[1] === x0) last[1] = x1
    else regions.push([x0, x1])

    const iv = evaluateInterval(expr, [x0, x1], variable)
    if (!iv) {
      flush()
      continue
    }
    const lo = Math.max(iv[0], yMin)
    const hi = Math.min(iv[1], yMax)
    if (lo > hi) {
      flush()
      continue
    }
    upper.push(`${x0} ${hi}`, `${x1} ${hi}`)
    lower.push(`${x0} ${lo}`, `${x1} ${lo}`)
  }
  flush()

  return { regions, band: band.trimEnd() }
}
