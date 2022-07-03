import * as React from "react"
import { Stroked } from "../../display/Theme"
import { Vector2 } from "../../math"
import { PointAngle } from "./PointAngle"

export interface PointSlopeProps extends Stroked {
  point: Vector2
  slope: number
}

export const PointSlope: React.VFC<PointSlopeProps> = ({ point, slope, ...rest }) => {
  return <PointAngle point={point} angle={Math.atan(slope)} {...rest} />
}
