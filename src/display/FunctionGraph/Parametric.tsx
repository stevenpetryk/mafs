import * as React from "react"
import { triangleArea, Vector2 } from "../../math"
import { Stroked } from "../../display/Theme"
import { useScaleContext } from "../../view/ScaleContext"

export interface ParametricProps extends Stroked {
  xy: (t: number) => Vector2
  t: [number, number]
  color?: string
  style?: "solid" | "dashed"
  /**
   * How deep the interpolation algorithm will go in terms of subdividing the function to find
   * points that minimize the jaggedness of the function. Defaults to 8.
   *
   * Most functions will not need to override this. It's mainly to support functions that are
   * very jagged.
   *
   * This value affects performance exponentially, O(2^n). The default value is 8, meaning functions
   * will be subdivided into at least 256 points. For any three consecutive points, if the area of
   * the triangle formed by those points is larger than 0.1 square pixels, the points will be
   * further, recursively subdivided.
   */
  minimumSamplingDepth?: number

  /**
   * @deprecated
   *
   * This prop used to represent number of samples used to render the function. It is now ignored.
   *
   * The algorithm that renders parametric functions now dynamically increases the
   * number of samples based on the roughness of the function. In some pathological cases, you may
   * still need to increase the sampling depth manually—but to do so, see `minimumSamplingDepth`.
   */
  samples?: never

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
  const areaThreshold = -0.1 / (scaleX(1) * scaleY(1))

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
      const xyMid = xy(mid)
      const xyMax = xy(max)

      const area = triangleArea(xyMin, xyMid, xyMax)

      if (depth < minimumSamplingDepth || area > areaThreshold) {
        smartSmooth(min, mid, true, false, depth + 1)
        smartSmooth(mid, max, false, true, depth + 1)
      } else {
        if (pushLeft) pathDescriptor += `${xyMin[0]} ${xyMin[1]} L `
        pathDescriptor += `${xyMid[0]} ${xyMid[1]} L `
        if (pushRight) pathDescriptor += `${xyMax[0]} ${xyMax[1]} L `
      }
    }

    smartSmooth(tMin, tMax, true, true)

    return pathDescriptor.substring(0, pathDescriptor.length - 3)
  }, [tMin, tMax, xy, areaThreshold, minimumSamplingDepth])

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
