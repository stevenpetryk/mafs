import * as React from "react"
import { Theme, Filled } from "./Theme"
import { useViewportTransformContext } from "../context/ViewTransformContext"
import { Vector2 } from "../vec"
import { useTransformContext } from "./Transform"
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
  const { toPxCSS: cssScale } = useViewportTransformContext()
  const transform = useTransformContext()

  const scaledPoints = points.map((point) => vec.transform(point, transform).join(" ")).join(" ")

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
