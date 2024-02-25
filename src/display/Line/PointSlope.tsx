import { Stroked } from "../../display/Theme"
import { vec } from "../../vec"
import { PointAngle } from "./PointAngle"

export interface PointSlopeProps extends Stroked {
  point: vec.Vector2
  slope: number
}

export function PointSlope({ point, slope, ...rest }: PointSlopeProps) {
  return <PointAngle point={point} angle={Math.atan(slope)} {...rest} />
}

PointSlope.displayName = "Line.PointSlope"
