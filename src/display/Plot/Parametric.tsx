import * as React from "react"
import { vec } from "../../vec"
import { Stroked } from "../Theme"
import { useTransformContext } from "../../context/TransformContext"
import { sampleParametric } from "./PlotUtils"

// TODO: (v1.0.0) When the project has it's first major (breaking) update,
//          remove the Legacy interface and just have the new props interface (renamed, of course).
//       Also, remove the `t` property at that time.
//       Waiting until the major update to batch them together,
//          and to give time for consumers to update their usage.

/**
 * Points at which the plotted function is discontinuous. The plot is broken at
 * these values so that discontinuities aren't connected with a straight line.
 *
 * This can either be a static list of values, or a function that receives the
 * current domain and returns a list of values (useful when the discontinuities
 * depend on the visible range).
 */
export type Exclusions = number[] | ((domain: vec.Vector2) => number[])

export interface ParametricPropsLegacy extends Stroked {
  /** A function that takes a `t` value and returns a point. */
  xy: (t: number) => vec.Vector2
  /** The domain between which to evaluate `xy`. */
  domain?: never
  /**
   * @deprecated - use the `domain` prop.
   */
  t: vec.Vector2
  /** The minimum recursive depth of the sampling algorithm. */
  minSamplingDepth?: number
  /** The maximum recursive depth of the sampling algorithm. */
  maxSamplingDepth?: number
  /** Points at which the function is discontinuous. */
  exclusions?: Exclusions

  svgPathProps?: React.SVGProps<SVGPathElement>
}

export interface ParametricPropsNew extends Stroked {
  /** A function that takes a `t` value and returns a point. */
  xy: (t: number) => vec.Vector2
  /** The domain between which to evaluate `xy`. */
  domain: vec.Vector2
  /**
   * @deprecated - use the `domain` prop.
   */
  t?: never
  /** The minimum recursive depth of the sampling algorithm. */
  minSamplingDepth?: number
  /** The maximum recursive depth of the sampling algorithm. */
  maxSamplingDepth?: number
  /** Points at which the function is discontinuous. */
  exclusions?: Exclusions

  svgPathProps?: React.SVGProps<SVGPathElement>
}

export type ParametricProps = ParametricPropsNew | ParametricPropsLegacy

export function Parametric({
  xy,
  domain,
  t,
  color,
  style = "solid",
  weight = 2,
  opacity = 1.0,
  maxSamplingDepth = 14,
  minSamplingDepth = 8,
  exclusions,
  svgPathProps = {},
}: ParametricProps) {
  const { viewTransform, userTransform } = useTransformContext()
  const transform = React.useMemo(
    () => vec.matrixMult(viewTransform, userTransform),
    [viewTransform, userTransform],
  )

  // Sampling quality should account for user transforms as well as the view
  // transform. The absolute determinant is the pixel area of one world-space
  // square (and remains positive when a transform flips an axis).
  const pixelsPerSquare = Math.abs(vec.det(transform))

  const [tMin, tMax] = domain || t
  const errorThreshold = 0.1 / pixelsPerSquare

  const exclusionPoints = React.useMemo(() => {
    if (!exclusions) return []
    return typeof exclusions === "function" ? exclusions([tMin, tMax]) : exclusions
  }, [exclusions, tMin, tMax])

  const svgPath = React.useMemo(
    () =>
      sampleParametric(
        xy,
        [tMin, tMax],
        minSamplingDepth,
        maxSamplingDepth,
        errorThreshold,
        exclusionPoints,
      ),
    [xy, minSamplingDepth, maxSamplingDepth, errorThreshold, tMin, tMax, exclusionPoints],
  )

  return (
    <path
      d={svgPath}
      strokeWidth={weight}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...svgPathProps}
      style={{
        stroke: color || "var(--mafs-fg)",
        strokeOpacity: opacity,
        strokeDasharray: style === "dashed" ? "var(--mafs-line-stroke-dash-style)" : undefined,
        vectorEffect: "non-scaling-stroke",
        transform: "var(--mafs-view-transform) var(--mafs-user-transform)",
        ...(svgPathProps.style || {}),
      }}
    />
  )
}

Parametric.displayName = "Plot.Parametric"
