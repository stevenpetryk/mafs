import { vec } from "../../vec"

interface SampleParams<P> {
  /** The function to sample */
  fn: (t: number) => P
  /** A function that computes the error between a real sample function output and a midpoint output */
  error: (real: P, estimate: P) => number
  /** A function that computes the lerp of two sample function outputs, for purpose of comparing to the function's real output */
  lerp: (p1: P, p2: P, t: number) => P
  /** A function that is called whenever a point should be part of the sample */
  onPoint: (t: number, p: P) => void
  /** The domain to sample */
  domain: [min: number, max: number]
  /** The minimum recursion depth */
  minDepth: number
  /** The maximum recursion depth */
  maxDepth: number
  /** The maximium tolerated error returned by the error function */
  threshold: number
  /**
   * Called for a final segment (between two consecutive `onPoint` calls) that
   * still had too much error at the maximum depth. That's usually a sign of a
   * discontinuity, which callers may want to look into.
   */
  onUnresolved?: (min: number, max: number, pMin: P, pMax: P) => void
  /** Whether a sampled value is real (defaults to always). */
  isDefined?: (p: P) => boolean
}

/**
 * Cheap psuedo-random hash function to consistently generate randomness when
 * sampling functions. This return a value between 0.4 and 0.6.
 */
function cheapHash(min: number, max: number) {
  const result = Math.sin(min * 12.9898 + max * 78.233) * 43758.5453
  return 0.4 + 0.2 * (result - Math.floor(result))
}

/**
 * A relatively generic internal function which, given a function, domain, and
 * an error function, will recursively subdivide the domain until sampling said
 * function at each point in the domain yields an error less than the supplied
 * threshold. Importantly, this makes no assumptions about the return type of
 * the sampled function.
 */
export function sample<SampledReturnType>({
  domain,
  minDepth,
  maxDepth,
  threshold,
  fn,
  error,
  onPoint,
  lerp,
  onUnresolved,
  isDefined = () => true,
}: SampleParams<SampledReturnType>) {
  const [min, max] = domain

  function subdivide(
    min: number,
    max: number,
    depth: number,
    pMin: SampledReturnType,
    pMax: SampledReturnType,
  ) {
    const t = cheapHash(min, max)
    const mid = min + (max - min) * t
    const pMid = fn(mid)

    function deepen() {
      subdivide(min, mid, depth + 1, pMin, pMid)
      onPoint(mid, pMid)
      subdivide(mid, max, depth + 1, pMid, pMax)
    }

    if (depth < minDepth) {
      deepen()
      return
    }

    const definedMin = isDefined(pMin)
    const definedMid = isDefined(pMid)
    const definedMax = isDefined(pMax)
    // Nothing to draw here at all.
    if (!definedMin && !definedMid && !definedMax) return

    // Partially defined segments get refined too, so we find where the function
    // starts or stops existing (e.g. sqrt(x) near 0) instead of skipping it.
    const partial = !(definedMin && definedMid && definedMax)
    const tooFar = partial || error(pMid, lerp(pMin, pMax, t)) > threshold

    if (!tooFar) return
    if (depth < maxDepth) deepen()
    else onUnresolved?.(min, max, pMin, pMax)
  }

  onPoint(min, fn(min))
  subdivide(min, max, 0, fn(min), fn(max))
  onPoint(max, fn(max))
}

export interface Box {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

const isFinitePoint = (p: vec.Vector2) => Number.isFinite(p[0]) && Number.isFinite(p[1])

/**
 * Clip the segment a-b to a box (Liang-Barsky). Returns null if the segment
 * lies entirely outside.
 */
function clipSegment(a: vec.Vector2, b: vec.Vector2, box: Box): [vec.Vector2, vec.Vector2] | null {
  let t0 = 0
  let t1 = 1
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const checks: [number, number][] = [
    [-dx, a[0] - box.xMin],
    [dx, box.xMax - a[0]],
    [-dy, a[1] - box.yMin],
    [dy, box.yMax - a[1]],
  ]
  for (const [p, q] of checks) {
    if (p === 0) {
      if (q < 0) return null
    } else {
      const r = q / p
      if (p < 0) {
        if (r > t1) return null
        if (r > t0) t0 = r
      } else {
        if (r < t0) return null
        if (r < t1) t1 = r
      }
    }
  }
  const at = (t: number): vec.Vector2 =>
    t === 0 ? a : t === 1 ? b : [a[0] + t * dx, a[1] + t * dy]
  const start = at(t0)
  const end = at(t1)
  // With huge coordinates (near an asymptote) t can round to exactly 0 or 1
  // even though the segment misses the box, so double check.
  const slackX = (box.xMax - box.xMin) * 1e-9
  const slackY = (box.yMax - box.yMin) * 1e-9
  const inside = (p: vec.Vector2) =>
    p[0] >= box.xMin - slackX &&
    p[0] <= box.xMax + slackX &&
    p[1] >= box.yMin - slackY &&
    p[1] <= box.yMax + slackY
  if (!inside(start) || !inside(end)) return null
  return [start, end]
}

/**
 * Builds an SVG path out of a stream of points, lifting the pen at gaps and
 * (optionally) clipping to a box so that points near an asymptote at y = 1e15
 * don't end up as giant coordinates in the DOM.
 */
export class PathBuilder {
  private d = ""
  private last: vec.Vector2 | null = null
  private penAt: vec.Vector2 | null = null

  constructor(private box?: Box) {}

  /** Start a new subpath at p (the pen is lifted). */
  moveTo(p: vec.Vector2) {
    this.last = isFinitePoint(p) ? p : null
    this.penAt = null
  }

  /** Lift the pen; the next point starts a new subpath. */
  break() {
    this.last = null
    this.penAt = null
  }

  lineTo(p: vec.Vector2) {
    if (!isFinitePoint(p)) {
      this.break()
      return
    }
    const last = this.last
    this.last = p
    if (!last) return

    const seg = this.box ? clipSegment(last, p, this.box) : [last, p]
    if (!seg) {
      this.penAt = null
      return
    }
    const [a, b] = seg
    if (this.penAt !== last || a !== last) this.d += `M ${a[0]} ${a[1]} `
    this.d += `L ${b[0]} ${b[1]} `
    this.penAt = b === p ? p : null
  }

  toString() {
    return this.d.trimEnd()
  }
}

function squareDistOrInfinity(a: vec.Vector2, b: vec.Vector2) {
  const d = vec.squareDist(a, b)
  return Number.isNaN(d) ? Infinity : d
}

/**
 * Given a segment that couldn't be resolved by adaptive sampling, decide
 * whether it contains a genuine discontinuity (a jump, an asymptote, or the
 * edge of the domain) or is just very steep.
 *
 * It repeatedly halves the segment, keeping whichever half has the bigger gap
 * between its endpoints. For a continuous function that gap shrinks to
 * nothing; across a discontinuity it never does. If it's a discontinuity,
 * returns the points on either side of it.
 */
export function findDiscontinuity(
  fn: (t: number) => vec.Vector2,
  a: number,
  b: number,
  pa: vec.Vector2,
  pb: vec.Vector2,
  threshold: number,
): [vec.Vector2, vec.Vector2] | null {
  for (let i = 0; i < 64; i++) {
    const m = (a + b) / 2
    if (m <= a || m >= b) break
    const pm = fn(m)
    const dl = squareDistOrInfinity(pa, pm)
    const dr = squareDistOrInfinity(pm, pb)
    if (dl >= dr) {
      b = m
      pb = pm
    } else {
      a = m
      pa = pm
    }
    if (Math.max(dl, dr) <= threshold) return null
  }
  return squareDistOrInfinity(pa, pb) <= threshold ? null : [pa, pb]
}

export function sampleParametric(
  fn: (t: number) => vec.Vector2,
  domain: vec.Vector2,
  minDepth: number,
  maxDepth: number,
  threshold: number,
  clip?: Box,
  path = new PathBuilder(clip),
) {
  sample({
    fn,
    error: (a, b) => vec.squareDist(a, b),
    isDefined: isFinitePoint,
    onPoint: (_t, p) => path.lineTo(p),
    onUnresolved: (min, max, pMin, pMax) => {
      const jump = findDiscontinuity(fn, min, max, pMin, pMax, threshold)
      if (jump) {
        // Draw right up to the discontinuity, then lift the pen.
        path.lineTo(jump[0])
        path.moveTo(jump[1])
      }
    },
    lerp: (p1, p2, t) => vec.lerp(p1, p2, t),
    domain,
    minDepth,
    maxDepth,
    threshold,
  })

  return path.toString()
}

export function sampleInequality(
  rangeAxis: "x" | "y",
  upper: (t: number) => number,
  lower: (t: number) => number,
  domain: vec.Vector2,
  minDepth: number,
  maxDepth: number,
  threshold: number,
) {
  const result = { fill: "", upper: "", lower: "" }

  let upperTmp = ""
  let lowerTmp = ""
  let ineqFalse = false

  let prevX = 0
  let prevUpper = 0
  let prevLower = 0

  function pointToString(x: number, y: number) {
    return rangeAxis === "x" ? `${x} ${y}` : `${y} ${x}`
  }

  sample<[vec.Vector2, vec.Vector2]>({
    domain,
    minDepth,
    maxDepth,
    threshold,
    fn: (x) => [
      [x, lower(x)],
      [x, upper(x)],
    ],
    error: ([realLower, realUpper], [estLower, estUpper]) => {
      return Math.max(vec.squareDist(realLower, estLower), vec.squareDist(realUpper, estUpper))
    },
    lerp: ([aLower, aUpper], [bLower, bUpper], t) => {
      return [vec.lerp(aLower, bLower, t), vec.lerp(aUpper, bUpper, t)]
    },
    onPoint: (x, [[, lower], [, upper]]) => {
      // TODO: these inequality operators should reflect the props, perhaps
      // the inequality operator itself should be a function passed into this
      const pathsJustCrossed = upper < lower && !ineqFalse
      const pathsJustUncrossed = upper > lower && ineqFalse

      if (pathsJustCrossed) {
        ineqFalse = true

        if (upperTmp && lowerTmp) {
          const midX = (prevX + x) / 2
          const midUpper = (prevUpper + upper) / 2
          const midLower = (prevLower + lower) / 2
          const midY = (midUpper + midLower) / 2
          upperTmp += ` ${pointToString(midX, midY)} L `
          lowerTmp = ` ${pointToString(midX, midY)} L ` + lowerTmp

          result.fill += ` M ${upperTmp} ${lowerTmp.substring(0, lowerTmp.length - 2)} z `
          result.upper += ` M ${upperTmp.substring(0, upperTmp.length - 2)} `
          result.lower += ` M ${lowerTmp.substring(0, lowerTmp.length - 2)} `
          upperTmp = ""
          lowerTmp = ""
        }
      } else if (pathsJustUncrossed) {
        ineqFalse = false
        const midX = (prevX + x) / 2
        const midUpper = (prevUpper + upper) / 2
        const midLower = (prevLower + lower) / 2
        const midY = (midUpper + midLower) / 2
        upperTmp += ` ${pointToString(midX, midY)} L `
        lowerTmp = ` ${pointToString(midX, midY)} L ` + lowerTmp
      }

      if (!ineqFalse) {
        if (Number.isFinite(upper)) {
          upperTmp = upperTmp + ` ${pointToString(x, upper)} L `
        }
        if (Number.isFinite(lower)) {
          lowerTmp = ` ${pointToString(x, lower)} L ` + lowerTmp
        }
      }

      prevX = x
      prevUpper = upper
      prevLower = lower
    },
  })

  // Push on the remaining upper and lower tmps, if any
  if (upperTmp && lowerTmp) {
    result.fill += ` M ${upperTmp} ${lowerTmp.substring(0, lowerTmp.length - 2)} z `
    result.lower += ` M ${lowerTmp.substring(0, lowerTmp.length - 2)} `
    result.upper += ` M ${upperTmp.substring(0, upperTmp.length - 2)} `
  }

  return result
}
