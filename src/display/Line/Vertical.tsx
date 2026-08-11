import { PointAngle, PointAngleProps } from "./PointAngle"

export interface VerticalProps extends Omit<PointAngleProps, "point" | "angle"> {
  /** The x-coordinate where the line is placed. */
  x: number
}

export function Vertical({ x, ...rest }: VerticalProps) {
  return <PointAngle point={[x, 0]} angle={Math.PI / 2} {...rest} />
}

Vertical.displayName = "Line.Vertical"
