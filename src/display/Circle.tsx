import React from "react"
import { Filled } from "./Theme"
import Ellipse from "./Ellipse"

export interface CircleProps extends Filled {
  center: Vector2
  radius: number
  svgEllipseProps?: React.SVGProps<SVGEllipseElement>
}

const Circle: React.VFC<CircleProps> = ({ radius, ...rest }) => {
  return <Ellipse radius={[radius, radius]} {...rest} />
}

export default Circle
