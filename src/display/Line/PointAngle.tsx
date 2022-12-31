import * as React from "react"
import { Stroked } from "../../display/Theme"
import * as vec from "../../vec"
import { ThroughPoints } from "./ThroughPoints"

export interface PointAngleProps extends Stroked {
  point: vec.Vector2
  angle: number
}

export const PointAngle: React.VFC<PointAngleProps> = ({ point, angle, ...rest }) => {
  const point2 = vec.add(point, vec.rotate([1, 0], angle))
  return <ThroughPoints point1={point} point2={point2} {...rest} />
}
