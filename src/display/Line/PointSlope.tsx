import { Vector2 } from "../../math"
import React from "react"
import { Stroked } from "../../display/Theme"
import PointAngle from "./PointAngle"

export interface PointSlopeProps extends Stroked {
  point: Vector2
  slope: number
}

const PointSlope: React.FC<PointSlopeProps> = ({ point, slope, ...rest }) => {
  return <PointAngle point={point} angle={Math.atan(slope)} {...rest} />
}

export default PointSlope
