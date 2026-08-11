import { PointAngle, PointAngleProps } from "./PointAngle"

export interface HorizontalProps extends Omit<PointAngleProps, "point" | "angle"> {
  /** The y-coordinate where the line is placed. */
  y: number
}

export function Horizontal({ y, ...rest }: HorizontalProps) {
  return <PointAngle point={[0, y]} angle={0} {...rest} />
}

Horizontal.displayName = "Line.Horizontal"
