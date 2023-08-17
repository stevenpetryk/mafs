import { Stroked } from "../../display/Theme"
import type { Vector2 } from "../../algebra/types"
import { PointAngle } from "./PointAngle"

export interface PointSlopeProps extends Stroked {
  point: Vector2
  slope: number
}

export function PointSlope({ point, slope, ...rest }: PointSlopeProps) {
  return <PointAngle point={point} angle={Math.atan(slope)} {...rest} />
}
