import * as React from "react"
import { Stroked, Theme } from "../../display/Theme"
import { useViewportTransformContext } from "../../context/ViewTransformContext"
import { round } from "../../math"
import * as vec from "../../vec"
import { useTransformContext } from "../Transform"

export interface SegmentProps extends Stroked {
  point1: vec.Vector2
  point2: vec.Vector2
}

export const Segment: React.VFC<SegmentProps> = ({
  point1,
  point2,
  color = Theme.foreground,
  style = "solid",
  weight = 2,
  opacity = 1.0,
}) => {
  const { toPx: pixelMatrix } = useViewportTransformContext()
  const transformContext = useTransformContext()
  const transform = vec.matrixMult(pixelMatrix, transformContext)

  const scaledPoint1 = vec.transform(point1, transform)
  const scaledPoint2 = vec.transform(point2, transform)

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
