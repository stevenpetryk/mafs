import * as React from "react"
import { Filled, Theme } from "./Theme"
import { vec } from "../vec"
import { useTransformContext } from "../context/TransformContext"

type SVGPolyProps<T extends "polygon" | "polyline"> = T extends "polygon"
  ? React.SVGProps<SVGPolygonElement>
  : React.SVGProps<SVGPolylineElement>

export interface PolyBaseProps extends Filled {
  points: vec.Vector2[]
}

interface PolyBaseInternalProps<T extends "polygon" | "polyline"> extends PolyBaseProps {
  element: T
  svgPolyProps?: SVGPolyProps<T>
}

export function PolyBase({
  element: PolyElement,
  points,
  color = Theme.foreground,
  weight = 2,
  fillOpacity = 0.15,
  strokeOpacity = 1.0,
  strokeStyle = "solid",
  svgPolyProps = {},
}: PolyBaseInternalProps<"polygon"> | PolyBaseInternalProps<"polyline">) {
  const { userTransform } = useTransformContext()

  const scaledPoints = points
    .map((point) => vec.transform(point, userTransform).join(" "))
    .join(" ")

  return (
    <PolyElement
      points={scaledPoints}
      strokeWidth={weight}
      fillOpacity={fillOpacity}
      strokeLinejoin="round"
      {...svgPolyProps}
      style={{
        fill: color,
        fillOpacity,
        stroke: color,
        strokeDasharray:
          strokeStyle === "dashed" ? "var(--mafs-line-stroke-dash-style)" : undefined,
        strokeOpacity,
        vectorEffect: "non-scaling-stroke",
        transform: "var(--mafs-view-transform)",
        ...(svgPolyProps.style || {}),
      }}
    />
  )
}
