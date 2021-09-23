import React from "react"
import { theme, Filled } from "./Theme"
import { useScaleContext } from "../view/ScaleContext"
import { Vector2 } from "../math"

export interface PolygonProps extends Filled {
  points: Vector2[]
  svgPolygonProps?: React.SVGProps<SVGPolygonElement>
}

const Polygon: React.FC<PolygonProps> = ({
  points,
  color = theme.foreground,
  weight = 2,
  fillOpacity = 0.15,
  strokeOpacity = 1.0,
  strokeStyle = "solid",
  svgPolygonProps = {},
}) => {
  const { cssScale } = useScaleContext()

  const scaledPoints = points.map((point) => point.join(" ")).join(" ")

  return (
    <polygon
      points={scaledPoints}
      strokeWidth={weight}
      fillOpacity={fillOpacity}
      strokeDasharray={strokeStyle === "dashed" ? "4,3" : undefined}
      strokeLinejoin="round"
      transform={cssScale}
      {...svgPolygonProps}
      style={{
        fill: color,
        fillOpacity,
        stroke: color,
        strokeOpacity,
        vectorEffect: "non-scaling-stroke",
        ...(svgPolygonProps.style || {}),
      }}
    ></polygon>
  )
}

export default Polygon
