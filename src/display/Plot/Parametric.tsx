import * as React from "react"
import * as vec from "../../vec"
import { Stroked } from "../Theme"
import { useScaleContext } from "../../view/ScaleContext"

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
  const { cssScale, scaleX, scaleY } = useScaleContext()

  const [tMin, tMax] = t
  const errorThreshold = 0.1 / (scaleX(1) * scaleY(-1))

  const svgPath = React.useMemo(() => {
    let pathDescriptor = "M "

    function smartSmooth(
      min: number,
      max: number,
      pushLeft: boolean,
      pushRight: boolean,
      depth = 0
    ) {
      const t = 0.5
      const mid = min + (max - min) * t

      if (depth < minSamplingDepth) {
        smartSmooth(min, mid, true, false, depth + 1)
        smartSmooth(mid, max, false, true, depth + 1)
        return
      }

      const [xyMinX, xyMinY] = xy(min)
      const [xyMidX, xyMidY] = xy(mid)
      const [xyMaxX, xyMaxY] = xy(max)

      if (depth < maxSamplingDepth) {
        const xyLerpMid = vec.lerp([xyMinX, xyMinY], [xyMaxX, xyMaxY], t)
        const error = vec.squareDist([xyMidX, xyMidY], xyLerpMid)
        if (error > errorThreshold) {
          smartSmooth(min, mid, true, false, depth + 1)
          smartSmooth(mid, max, false, true, depth + 1)
          return
        }
      }

      if (pushLeft && Number.isFinite(xyMinX) && Number.isFinite(xyMinY)) {
        pathDescriptor += `${xyMinX} ${xyMinY} L `
      }
      if (Number.isFinite(xyMidX) && Number.isFinite(xyMidY))
        pathDescriptor += `${xyMidX} ${xyMidY} L `
      if (pushRight && Number.isFinite(xyMaxX) && Number.isFinite(xyMaxY))
        pathDescriptor += `${xyMaxX} ${xyMaxY} L `
    }

    smartSmooth(tMin, tMax, true, true)

    return pathDescriptor.substring(0, pathDescriptor.length - 3)
  }, [tMin, tMax, xy, errorThreshold, minSamplingDepth, maxSamplingDepth])

  return (
    <path
      d={svgPath}
      strokeWidth={weight}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={style === "dashed" ? "1,10" : undefined}
      transform={cssScale}
      {...svgPathProps}
      style={{
        stroke: color || "var(--mafs-fg)",
        strokeOpacity: opacity,
        vectorEffect: "non-scaling-stroke",
        ...(svgPathProps.style || {}),
      }}
    />
  )
}
