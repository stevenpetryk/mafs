import React from "react"
import * as vec from "vec-la"
import { Stroked, theme } from "../../display/Theme"
import { useScaleContext } from "../../view/ScaleContext"
import { round, Vector2 } from "../../math"

export interface SegmentProps extends Stroked {
  point1: Vector2
  point2: Vector2
}

const Segment: React.FC<SegmentProps> = ({
  point1,
  point2,
  color = theme.foreground,
  style = "solid",
  weight = 2,
  opacity = 1.0,
}) => {
  const { pixelMatrix } = useScaleContext()

  const scaledPoint1 = vec.transform(point1, pixelMatrix)
  const scaledPoint2 = vec.transform(point2, pixelMatrix)

  return (
    <line
      x1={round(scaledPoint1[0], 2)}
      y1={round(scaledPoint1[1], 2)}
      x2={round(scaledPoint2[0], 2)}
      y2={round(scaledPoint2[1], 2)}
      style={{ stroke: color }}
      strokeWidth={weight}
      opacity={opacity}
      strokeDasharray={style === "dashed" ? "1,10" : undefined}
    />
  )
}

export default Segment
