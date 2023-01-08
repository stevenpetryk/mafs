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
   * The maximum recursive depth of the sampling algorithm. Increasing this value will improve the
   * quality of the plot, but comes with an exponential cost to performance.
   */
  minimumSamplingDepth?: number

  svgPathProps?: React.SVGProps<SVGPathElement>
}

export const ParametricFunction: React.VFC<ParametricProps> = ({
  xy,
  t,
  color,
  style = "solid",
  weight = 2,
  opacity = 1.0,
  minimumSamplingDepth = 8,
  svgPathProps = {},
}) => {
  const { cssScale, scaleX, scaleY } = useScaleContext()

  const [tMin, tMax] = t
  const errorThreshold = 1 / (scaleX(1) * scaleY(-1))

  const svgPath = React.useMemo(() => {
    let pathDescriptor = "M "

    function smartSmooth(
      min: number,
      max: number,
      pushLeft: boolean,
      pushRight: boolean,
      depth = 0
    ) {
      const mid = (min + max) / 2

      const xyMin = xy(min)
      const xyMax = xy(max)

      // Error term
      const xyMid = xy(mid)
      const xyLerpMid = vec.lerp(xyMin, xyMax, 0.5)
      const error = vec.squareDist(xyMid, xyLerpMid)

      if (depth < 20 && (depth < minimumSamplingDepth || error > errorThreshold)) {
        smartSmooth(min, mid, true, false, depth + 1)
        smartSmooth(mid, max, false, true, depth + 1)
      } else {
        if (isFinite(xyMin) && pushLeft) pathDescriptor += `${xyMin[0]} ${xyMin[1]} L `
        if (isFinite(xyMid)) pathDescriptor += `${xyMid[0]} ${xyMid[1]} L `
        if (isFinite(xyMax) && pushRight) pathDescriptor += `${xyMax[0]} ${xyMax[1]} L `
      }
    }

    smartSmooth(tMin, tMax, true, true)

    return pathDescriptor.substring(0, pathDescriptor.length - 3)
  }, [tMin, tMax, xy, errorThreshold, minimumSamplingDepth])

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
