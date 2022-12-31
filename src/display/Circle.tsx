import { Filled } from "./Theme"
import { Ellipse } from "./Ellipse"
import { Vector2 } from "../vec"
import type * as React from "react"

export interface CircleProps extends Filled {
  center: Vector2
  radius: number
  svgEllipseProps?: React.SVGProps<SVGEllipseElement>
}

export const Circle: React.VFC<CircleProps> = ({ radius, ...rest }) => {
  return <Ellipse radius={[radius, radius]} {...rest} />
}
