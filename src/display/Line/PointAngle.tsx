import { Vector2 } from "../../math"
import React from "react"
import * as vec from "vec-la"
import { Stroked } from "../../display/Theme"
import ThroughPoints from "./ThroughPoints"

export interface PointAngleProps extends Stroked {
  point: Vector2
  angle: number
}

const PointAngle: React.FC<PointAngleProps> = ({ point, angle, ...rest }) => {
  const point2 = vec.add(point, vec.rotate([1, 0], angle))
  return <ThroughPoints point1={point} point2={point2} {...rest} />
}

export default PointAngle
