import * as React from "react"
import { Theme, Filled } from "./Theme"
import { Vector2 } from "../vec"
import { useTransformContext } from "../context/TransformContext"
import * as vec from "../vec"

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
  const { userTransform } = useTransformContext()

  const scaledPoints = points
    .map((point) => vec.transform(point, userTransform).join(" "))
    .join(" ")

  return (
    <polygon
      points={scaledPoints}
      strokeWidth={weight}
      fillOpacity={fillOpacity}
      strokeDasharray={strokeStyle === "dashed" ? "4,3" : undefined}
      strokeLinejoin="round"
      {...svgPolygonProps}
      style={{
        fill: color,
        fillOpacity,
        stroke: color,
        strokeOpacity,
        vectorEffect: "non-scaling-stroke",
        transform: "var(--mafs-view-transform)",
        ...(svgPolygonProps.style || {}),
      }}
    ></polygon>
  )
}
