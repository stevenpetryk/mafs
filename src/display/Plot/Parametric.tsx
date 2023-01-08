import * as React from "react"
import * as vec from "../../vec"
import { Stroked } from "../Theme"
import { useScaleContext } from "../../view/ScaleContext"

export interface ParametricProps extends Stroked {
  /** A function that takes a `t` value and returns a point. */
  xy: (t: number) => vec.Vector2
  /** The domain `t` between which to evaluate `xy`. */
  t: [number, number]
  color?: string
  style?: "solid" | "dashed"

  /**
   * The maximum recursive depth of the sampling algorithm.
   */
  maxSamplingDepth?: number

  svgPathProps?: React.SVGProps<SVGPathElement>
}

export const ParametricFunction: React.VFC<ParametricProps> = ({
  xy,
  t,
  color,
  style = "solid",
  weight = 2,
  opacity = 1.0,
  maxSamplingDepth = 10,
  svgPathProps = {},
}) => {
  const { cssScale, scaleX, scaleY } = useScaleContext()

  const [tMin, tMax] = t
  const errorThreshold = 0.1 / (scaleX(1) * scaleY(-1))

  const svgPath = React.useMemo(() => {
    let maxDepth = 0
    let numPoints = 0
    let pathDescriptor = "M "

    function smartSmooth(
      min: number,
      max: number,
      pushLeft: boolean,
      pushRight: boolean,
      depth = 0
    ) {
      maxDepth = Math.max(maxDepth, depth)

      // Generate random t value near 0.5
      const t = (Math.random() - 0.5) * 0.2 + 0.5

      const mid = min + (max - min) * t

      const xyMin = xy(min)
      const xyMax = xy(max)

      // Error term
      const xyMid = xy(mid)
      const xyLerpMid = vec.lerp(xyMin, xyMax, t)
      const error = vec.squareDist(xyMid, xyLerpMid)

      if ((error > errorThreshold && depth < maxSamplingDepth) || depth < 6) {
        smartSmooth(min, mid, true, false, depth + 1)
        smartSmooth(mid, max, false, true, depth + 1)
      } else {
        if (isFinite(xyMin) && pushLeft) {
          numPoints++
          pathDescriptor += `${xyMin[0]} ${xyMin[1]} L `
        }
        if (isFinite(xyMid)) {
          numPoints++
          pathDescriptor += `${xyMid[0]} ${xyMid[1]} L `
        }
        if (isFinite(xyMax) && pushRight) {
          numPoints++
          pathDescriptor += `${xyMax[0]} ${xyMax[1]} L `
        }
      }
    }

    const start = performance.now()
    smartSmooth(tMin, tMax, true, true)
    const duration = performance.now() - start

    // console.log(`${duration.toFixed(1)}ms`, maxDepth, numPoints)

    return pathDescriptor.substring(0, pathDescriptor.length - 3)
  }, [tMin, tMax, xy, errorThreshold, maxSamplingDepth])

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

function isFinite(v: vec.Vector2) {
  return Number.isFinite(v[0]) && Number.isFinite(v[1])
}
