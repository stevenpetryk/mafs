import * as React from "react"
import { PolyBase, PolyBaseProps } from "./PolyBase"

export interface PolygonProps extends PolyBaseProps {
  svgPolygonProps?: React.SVGProps<SVGPolygonElement>
}

export function Polygon({ svgPolygonProps, ...otherProps }: PolygonProps) {
  return <PolyBase element="polygon" svgPolyProps={svgPolygonProps} {...otherProps} />
}

Polygon.displayName = "Polygon"
