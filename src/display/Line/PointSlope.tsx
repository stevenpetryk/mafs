import React from "react"
import { Stroked } from "../../display/Theme"
import PointAngle from "./PointAngle"
import { Vector2 } from "typings/math"

export interface PointSlopeProps extends Stroked {
  point: Vector2
  slope: number
}

const PointSlope: React.VFC<PointSlopeProps> = ({ point, slope, ...rest }) => {
  return <PointAngle point={point} angle={Math.atan(slope)} {...rest} />
}

export default PointSlope
