import * as React from "react"
import * as vec from "vec-la"
import { Stroked, Theme } from "../../display/Theme"
import { useScaleContext } from "../../view/ScaleContext"
import { round, Vector2 } from "../../math"

export interface ThroughPointsProps extends Stroked {
  point1: Vector2
  point2: Vector2
}

export const ThroughPoints: React.VFC<ThroughPointsProps> = ({
  point1,
  point2,
  color = Theme.foreground,
  style = "solid",
  weight = 2,
  opacity = 1.0,
}) => {
  const { pixelMatrix } = useScaleContext()
  const segment = vec.scale(vec.norm(vec.sub(point2, point1)), 100000)

  const scaledPoint1 = vec.transform(vec.sub(point1, segment), pixelMatrix)
  const scaledPoint2 = vec.transform(vec.add(point2, segment), pixelMatrix)

  return (
    <line
      x1={round(scaledPoint1[0], 2)}
      y1={round(scaledPoint1[1], 2)}
      x2={round(scaledPoint2[0], 2)}
      y2={round(scaledPoint2[1], 2)}
      style={{ stroke: color }}
      strokeWidth={weight}
      opacity={opacity}
      strokeDasharray={style === "dashed" ? "4,3" : undefined}
    />
  )
}
