import * as React from "react"
import * as vec from "../../vec"
import { Stroked } from "../Theme"
import { useViewTransform } from "../../context/ViewTransformContext"
import { adaptiveSampling } from "./PlotUtils"

export interface ParametricProps extends Stroked {
  /** A function that takes a `t` value and returns a point. */
  xy: (t: number) => vec.Vector2
  /** The domain `t` between which to evaluate `xy`. */
  t: vec.Vector2
  /** The minimum recursive depth of the sampling algorithm. */
  minSamplingDepth?: number
  /** The maximum recursive depth of the sampling algorithm. */
  maxSamplingDepth?: number

  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function Parametric({
  xy,
  t,
  color,
  style = "solid",
  weight = 2,
  opacity = 1.0,
  maxSamplingDepth = 14,
  minSamplingDepth = 8,
  svgPathProps = {},
}: ParametricProps) {
  const { toPx } = useViewTransform()

  // Negative because the y-axis is flipped in the SVG coordinate system.
  const pixelsPerSquare = -vec.det(toPx)

  const [tMin, tMax] = t
  const errorThreshold = 0.1 / pixelsPerSquare

  const svgPath = React.useMemo(
    () => adaptiveSampling(xy, [tMin, tMax], minSamplingDepth, maxSamplingDepth, errorThreshold),
    [xy, minSamplingDepth, maxSamplingDepth, errorThreshold, tMin, tMax]
  )

  return (
    <path
      d={svgPath}
      strokeWidth={weight}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={style === "dashed" ? "1,10" : undefined}
      {...svgPathProps}
      style={{
        stroke: color || "var(--mafs-fg)",
        strokeOpacity: opacity,
        vectorEffect: "non-scaling-stroke",
        transform: "var(--mafs-transform-to-px)",
        ...(svgPathProps.style || {}),
      }}
    />
  )
}
