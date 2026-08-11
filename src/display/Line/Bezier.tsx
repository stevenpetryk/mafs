import * as React from "react"
import { Stroked, Theme } from "../../display/Theme"
import { useTransformContext } from "../../context/TransformContext"
import { round } from "../../math"
import { vec } from "../../vec"

export interface BezierProps extends Stroked {
  /** The point where the curve begins. */
  start: vec.Vector2
  /** The point where the curve ends. */
  end: vec.Vector2
  /** The first control point, which "pulls" the curve towards it near `start`. */
  control1: vec.Vector2
  /**
   * An optional second control point, which "pulls" the curve towards it near
   * `end`. When provided, the curve is a cubic Bézier; when omitted, it is a
   * quadratic Bézier.
   */
  control2?: vec.Vector2
  svgPathProps?: React.SVGProps<SVGPathElement>
}

function format(point: vec.Vector2): string {
  return `${round(point[0], 2)} ${round(point[1], 2)}`
}

export function Bezier({
  start,
  end,
  control1,
  control2,
  color = Theme.foreground,
  style = "solid",
  weight = 2,
  opacity = 1.0,
  svgPathProps = {},
}: BezierProps) {
  const { viewTransform: pixelMatrix, userTransform } = useTransformContext()
  const transform = vec.matrixMult(pixelMatrix, userTransform)

  const p0 = vec.transform(start, transform)
  const c1 = vec.transform(control1, transform)
  const p1 = vec.transform(end, transform)

  // A cubic Bézier needs two control points; a quadratic needs one. Since SVG
  // supports both, we emit whichever matches the props (#76).
  const d = control2
    ? `M ${format(p0)} C ${format(c1)}, ${format(vec.transform(control2, transform))}, ${format(p1)}`
    : `M ${format(p0)} Q ${format(c1)}, ${format(p1)}`

  return (
    <path
      d={d}
      fill="none"
      style={{
        stroke: color,
        strokeDasharray: style === "dashed" ? "var(--mafs-line-stroke-dash-style)" : undefined,
      }}
      strokeWidth={weight}
      opacity={opacity}
      strokeLinecap="round"
      {...svgPathProps}
    />
  )
}

Bezier.displayName = "Line.Bezier"
