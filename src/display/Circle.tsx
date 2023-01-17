import { Filled } from "./Theme"
import { Ellipse } from "./Ellipse"
import { vec } from "../vec"
import type * as React from "react"

export interface CircleProps extends Filled {
  center: vec.Vector2
  radius: number
  svgEllipseProps?: React.SVGProps<SVGEllipseElement>
}

export function Circle({ radius, ...rest }: CircleProps) {
  return <Ellipse radius={[radius, radius]} {...rest} />
}

Circle.displayName = "Circle"
