import * as React from "react"
import { Filled, Theme } from "./Theme"
import { vec } from "../algebra"
import type { Vector2 } from "../algebra/types"
import { useTransformContext } from "../context/TransformContext"

type SVGPolyProps<T extends "polygon" | "polyline"> = T extends "polygon"
  ? React.SVGProps<SVGPolygonElement>
  : React.SVGProps<SVGPolylineElement>

export interface PolyBaseProps extends Filled {
  points: Vector2[]
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
      strokeDasharray={strokeStyle === "dashed" ? "4,3" : undefined}
      strokeLinejoin="round"
      {...svgPolyProps}
      style={{
        fill: color,
        fillOpacity,
        stroke: color,
        strokeOpacity,
        vectorEffect: "non-scaling-stroke",
        transform: "var(--mafs-view-transform)",
        ...(svgPolyProps.style || {}),
      }}
    />
  )
}
