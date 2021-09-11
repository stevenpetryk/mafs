import React, { useMemo } from "react"
import { triangleArea, Vector2 } from "../../math"
import { Stroked } from "../../display/Theme"
import { useScaleContext } from "../../view/ScaleContext"

export interface ParametricProps extends Stroked {
  xy: (t: number) => Vector2
  t: [number, number]
  color?: string
  samples?: number
  style?: "solid" | "dashed"
  svgPathProps?: React.SVGProps<SVGPathElement>
}

const ParametricFunction: React.VFC<ParametricProps> = ({
  xy,
  t,
  color,
  style = "solid",
  weight = 2,
  opacity = 1.0,
  svgPathProps = {},
}) => {
  const { cssScale, scaleX, scaleY } = useScaleContext()

  const [tMin, tMax] = t
  const areaThreshold = -0.1 / (scaleX(1) * scaleY(1))

  const svgPath = useMemo(() => {
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

      if (depth < 8 || area > areaThreshold) {
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
  }, [tMin, tMax, xy, areaThreshold])

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

export default ParametricFunction
