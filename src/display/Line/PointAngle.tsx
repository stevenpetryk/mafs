import * as React from "react"
import * as vec from "vec-la"
import { Stroked } from "../../display/Theme"
import { Vector2 } from "../../math"
import { ThroughPoints } from "./ThroughPoints"

export interface PointAngleProps extends Stroked {
  point: Vector2
  angle: number
}

export const PointAngle: React.VFC<PointAngleProps> = ({ point, angle, ...rest }) => {
  const point2 = vec.add(point, vec.rotate([1, 0], angle))
  return <ThroughPoints point1={point} point2={point2} {...rest} />
}
