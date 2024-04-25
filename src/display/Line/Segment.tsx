import { Stroked, Theme } from "../../display/Theme"
import { useTransformContext } from "../../context/TransformContext"
import { round } from "../../math"
import { vec } from "../../vec"

export interface SegmentProps extends Stroked {
  point1: vec.Vector2
  point2: vec.Vector2
}

export function Segment({
  point1,
  point2,
  color = Theme.foreground,
  style = "solid",
  weight = 2,
  opacity = 1.0,
}: SegmentProps) {
  const { viewTransform: pixelMatrix, userTransform } = useTransformContext()
  const transform = vec.matrixMult(pixelMatrix, userTransform)

  const scaledPoint1 = vec.transform(point1, transform)
  const scaledPoint2 = vec.transform(point2, transform)

  return (
    <line
      x1={round(scaledPoint1[0], 2)}
      y1={round(scaledPoint1[1], 2)}
      x2={round(scaledPoint2[0], 2)}
      y2={round(scaledPoint2[1], 2)}
      style={{
        stroke: color,
        strokeDasharray: style === "dashed" ? "var(--mafs-line-stroke-dash-style)" : undefined,
      }}
      strokeWidth={weight}
      opacity={opacity}
    />
  )
}

Segment.displayName = "Line.Segment"
