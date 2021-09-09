import React, { useCallback, useMemo } from "react"
import { useScaleContext } from "../../view/ScaleContext"
import { Stroked } from "../../display/Theme"
import SortedArrayMap from "collections/sorted-array-map"
import { Theme, Vector2 } from "../.."
import Point from "../Point"

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

  const triangleArea = useCallback(
    (a: Vector2, b: Vector2, c: Vector2) => {
      const totalScale = scaleX(1) * scaleY(1) * -1
      const ax = a[0]
      const ay = a[1]
      const bx = b[0]
      const by = b[1]
      const cx = c[0]
      const cy = c[1]
      return totalScale * Math.abs((ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) / 2)
    },
    [scaleX, scaleY]
  )

  const [tMin, tMax] = t

  const points = useMemo(() => {
    const points = new SortedArrayMap<number, Vector2>()

    points.set(tMin, xy(tMin))
    points.set(tMax, xy(tMax))

    const areaThreshold = 0.5

    function tesselate(min: number, mid: number, max: number, depth = 0) {
      points.set(mid, xy(mid))
      const area = triangleArea(points.get(min), points.get(mid), points.get(max))
      if (area > areaThreshold || depth < 8) {
        const leftMid = (mid + min) / 2
        const rightMid = (max + mid) / 2
        tesselate(min, leftMid, mid, depth + 1)
        tesselate(mid, rightMid, max, depth + 1)
      }
    }

    tesselate(tMin, (tMin + tMax) / 2, tMax)

    const pointsArray = [...points.values()]
    if (tMin > tMax) {
      pointsArray.reverse()
    }
    return pointsArray
  }, [tMin, tMax, xy, triangleArea])

  const pathDescriptor = "M " + points.map((p) => p.join(" ")).join(" L ")

  return (
    <path
      d={pathDescriptor}
      strokeWidth={weight}
      tabIndex={0}
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
