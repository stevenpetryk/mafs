import * as React from "react"
import { usePaneContext } from "../../context/PaneContext"
import { useTransformContext } from "../../context/TransformContext"
import { Parametric, ParametricProps, useClipBox } from "./Parametric"
import { vec } from "../../vec"
import { Expr } from "../../cas/expr"
import { parse } from "../../cas/parse"
import { analyze, Feature } from "../../cas/analyze"
import { sampleExpression } from "./sampleExpression"

export interface OfXProps extends Omit<ParametricProps, "xy" | "domain" | "t"> {
  /**
   * The function to plot. Either a JavaScript function, or a math expression
   * in `x` (as a string like `"sin(1/x)"`, or a parsed `cas.Expr`).
   *
   * Expressions are analyzed symbolically, which lets Mafs plot them much more
   * faithfully: no false vertical lines at asymptotes or jumps, holes drawn
   * as open circles, and functions that oscillate faster than a pixel (like
   * sin(1/x) near 0) shaded as a band instead of aliased.
   */
  y: ((x: number) => number) | string | Expr
  domain?: vec.Vector2
  svgPathProps?: React.SVGProps<SVGPathElement>
  /**
   * For expressions: mark holes, jumps and domain endpoints with open/filled
   * dots. Defaults to `true`.
   */
  showDiscontinuities?: boolean
  /** For expressions: draw dashed lines at vertical asymptotes. Defaults to `true`. */
  showAsymptotes?: boolean
}

export function OfX({ y, domain, showDiscontinuities, showAsymptotes, ...props }: OfXProps) {
  const [xuMin, xuMax] = domain ?? [-Infinity, Infinity]
  const {
    xPaneRange: [xpMin, xpMax],
  } = usePaneContext()
  // Determine the most restrictive range values (either user-provided or the pane context)
  const xMin = Math.max(xuMin, xpMin)
  const xMax = Math.min(xuMax, xpMax)

  if (typeof y !== "function") {
    return (
      <ExpressionPlot
        expr={y}
        domain={[xMin, xMax]}
        showDiscontinuities={showDiscontinuities}
        showAsymptotes={showAsymptotes}
        {...props}
      />
    )
  }

  return <FunctionPlot y={y} domain={[xMin, xMax]} {...props} />
}

OfX.displayName = "Plot.OfX"

function FunctionPlot({
  y,
  domain: [xMin, xMax],
  ...props
}: Omit<OfXProps, "y" | "domain"> & { y: (x: number) => number; domain: vec.Vector2 }) {
  const xy = React.useCallback<ParametricProps["xy"]>((x) => [x, y(x)], [y])
  const parametricDomain = React.useMemo<vec.Vector2>(() => [xMin, xMax], [xMin, xMax])
  return <Parametric xy={xy} domain={parametricDomain} {...props} />
}

type ExpressionPlotProps = Omit<OfXProps, "y" | "domain"> & {
  expr: string | Expr
  domain: vec.Vector2
}

function ExpressionPlot({
  expr: input,
  domain: [xMin, xMax],
  color,
  style = "solid",
  weight = 2,
  opacity = 1.0,
  maxSamplingDepth = 14,
  minSamplingDepth = 8,
  svgPathProps = {},
  showDiscontinuities = true,
  showAsymptotes = true,
}: ExpressionPlotProps) {
  const { viewTransform, userTransform } = useTransformContext()
  const clip = useClipBox()

  const expr = React.useMemo(() => (typeof input === "string" ? parse(input) : input), [input])

  // The pane range only changes when panning crosses a pane boundary, so this
  // (relatively expensive) symbolic analysis rarely reruns.
  const analysis = React.useMemo(() => analyze(expr, [xMin, xMax]), [expr, xMin, xMax])

  const pixelsPerSquare = -vec.det(viewTransform)
  const threshold = 0.1 / pixelsPerSquare
  const pixelWidth = 1 / Math.abs(viewTransform[0])

  const { curve, band, features } = React.useMemo(
    () =>
      sampleExpression({
        expr,
        analysis,
        domain: [xMin, xMax],
        pixelWidth,
        minDepth: minSamplingDepth,
        maxDepth: maxSamplingDepth,
        threshold,
        clip,
      }),
    [expr, analysis, xMin, xMax, pixelWidth, minSamplingDepth, maxSamplingDepth, threshold, clip],
  )

  const stroke = color || "var(--mafs-fg)"
  const pathStyle: React.CSSProperties = {
    vectorEffect: "non-scaling-stroke",
    transform: "var(--mafs-view-transform)",
  }

  const toPixels = vec.matrixMult(viewTransform, userTransform)
  const yMin = clip?.yMin ?? -1e6
  const yMax = clip?.yMax ?? 1e6

  return (
    <g>
      {showAsymptotes &&
        features
          .filter((f) => f.kind === "pole")
          .map((f) => (
            <line
              key={`asymptote-${f.x}`}
              x1={f.x}
              x2={f.x}
              y1={yMin}
              y2={yMax}
              style={{
                ...pathStyle,
                stroke,
                strokeOpacity: opacity * 0.5,
                strokeWidth: 1,
                strokeDasharray: "var(--mafs-line-stroke-dash-style)",
              }}
            />
          ))}
      {band && (
        <path
          d={band}
          style={{
            ...pathStyle,
            fill: stroke,
            fillOpacity: opacity * 0.6,
            stroke,
            strokeOpacity: opacity * 0.6,
            strokeWidth: 1,
          }}
        />
      )}
      <path
        d={curve}
        strokeWidth={weight}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...svgPathProps}
        style={{
          ...pathStyle,
          stroke,
          strokeOpacity: opacity,
          strokeDasharray: style === "dashed" ? "var(--mafs-line-stroke-dash-style)" : undefined,
          ...(svgPathProps.style || {}),
        }}
      />
      {showDiscontinuities &&
        features.flatMap((f) =>
          markersFor(f).map(({ y, open }, i) => {
            if (y < yMin || y > yMax) return null
            const [cx, cy] = vec.transform([f.x, y], toPixels)
            return (
              <circle
                key={`${f.x}-${i}`}
                cx={cx}
                cy={cy}
                r={4.5}
                style={{
                  fill: open ? "var(--mafs-bg)" : stroke,
                  stroke,
                  strokeWidth: 2,
                  opacity,
                }}
              />
            )
          }),
        )}
    </g>
  )
}

function close(a: number, b: number) {
  return Math.abs(a - b) <= 1e-6 * (1 + Math.abs(a) + Math.abs(b))
}

/**
 * Textbook notation: a filled dot where the function has a value, an open
 * dot where a one-sided limit exists but the function doesn't take it.
 */
function markersFor(f: Feature): { y: number; open: boolean }[] {
  if (f.kind === "kink" || f.kind === "essential") return []
  const out: { y: number; open: boolean }[] = []
  const defined = Number.isFinite(f.value)
  if (defined) out.push({ y: f.value, open: false })
  for (const side of [f.left, f.right]) {
    if (side.type !== "finite") continue
    const L = side.limit
    if (defined && close(L, f.value)) continue
    if (out.some((m) => close(m.y, L))) continue
    out.push({ y: L, open: true })
  }
  // A defined endpoint of a pole (like e^(1/x) at 0) isn't interesting.
  if (f.kind === "pole" && !out.some((m) => m.open)) return []
  return out
}
