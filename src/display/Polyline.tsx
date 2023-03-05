import * as React from "react"
import { PolyBase, PolyBaseProps } from "./PolyBase"

export interface PolylineProps extends PolyBaseProps {
  svgPolylineProps?: React.SVGProps<SVGPolylineElement>
}

export function Polyline({ fillOpacity = 0, svgPolylineProps, ...otherProps }: PolylineProps) {
  return (
    <PolyBase
      element="polyline"
      fillOpacity={fillOpacity}
      svgPolyProps={svgPolylineProps}
      {...otherProps}
    />
  )
}

Polyline.displayName = "Polyline"
