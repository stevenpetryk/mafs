import * as React from "react"
import { vec } from "../../vec"
import { Stroked } from "../Theme"
import { useTransformContext } from "../../context/TransformContext"
import { useCoordinateContext } from "../../context/CoordinateContext"
import { sampleParametric } from "./PlotUtils"
import invariant from "tiny-invariant"

export interface ParametricProps extends Stroked {
  /** A function that takes a `t` value and returns a point. */
  xy: (t: number) => vec.Vector2
  /** The domain `t` between which to evaluate `xy`. */
  t: vec.Vector2

  /**
   * TODO
   */
  keyPoints?: any

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
  keyPoints: keyPointGenerator = () => [],
}: ParametricProps) {
  const { xMin, xMax, yMin, yMax } = useCoordinateContext()
  const { viewTransform } = useTransformContext()

  const inverseViewTransform = vec.matrixInvert(viewTransform)
  invariant(inverseViewTransform, "viewTransform is not invertible")

  // Negative because the y-axis is flipped in the SVG coordinate system.
  const pixelsPerSquare = -vec.det(viewTransform)

  const [tMin, tMax] = t
  const errorThreshold = 0.1 / pixelsPerSquare

  const keyPoints = keyPointGenerator()

  const svgPath = React.useMemo(
    () =>
      sampleParametric(
        xy,
        [tMin, tMax],
        minSamplingDepth,
        maxSamplingDepth,
        errorThreshold,
        keyPoints,
      ),
    [xy, minSamplingDepth, maxSamplingDepth, errorThreshold, tMin, tMax, keyPoints],
  )

  const holes = keyPoints.filter((kp) => kp.type === "hole")

  const maskId = `myMask-${React.useId()}`

  const holeRadius = 15

  return (
    <g>
      <mask id={maskId}>
        <rect x={xMin} y={yMin} width={xMax - xMin} height={yMax - yMin} fill="white" />
        {holes.map((hole, i) => {
          const [cx, cy] = hole.at
          const [rx, ry] = vec.transform([holeRadius, -holeRadius], inverseViewTransform)

          return <ellipse key={i} {...{ cx, cy, rx, ry }} fill="black" />
        })}
      </mask>
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
          transform: "var(--mafs-view-transform)",
          ...(svgPathProps.style || {}),
        }}
      />

      {holes.length && (
        <g className="holes">
          {holes.map((hole, i) => {
            const [x, y] = vec.transform(hole.at, viewTransform)

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={holeRadius}
                style={{
                  stroke: color || "var(--mafs-fg)",
                  strokeWidth: 2,
                  vectorEffect: "non-scaling-stroke",
                  fill: "none",
                }}
              />
            )
          })}
        </g>
      )}
    </g>
  )
}
