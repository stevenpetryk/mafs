import * as React from "react"
import { Theme, Filled } from "./Theme"
import { useScaleContext } from "../view/ScaleContext"
import { Vector2 } from "../math"

export interface PolygonProps extends Filled {
  points: Vector2[]
  svgPolygonProps?: React.SVGProps<SVGPolygonElement>
}

export const Polygon: React.VFC<PolygonProps> = ({
  points,
  color = Theme.foreground,
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
