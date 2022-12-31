import * as React from "react"
import { Stroked, Theme } from "../../display/Theme"
import { useScaleContext } from "../../view/ScaleContext"
import { round } from "../../math"
import * as vec from "../../vec"
import { useTransformContext } from "../Group"

export interface ThroughPointsProps extends Stroked {
  point1: vec.Vector2
  point2: vec.Vector2
}

export function ThroughPoints({
  point1,
  point2,
  color = Theme.foreground,
  style = "solid",
  weight = 2,
  opacity = 1.0,
}: ThroughPointsProps) {
  const { pixelMatrix } = useScaleContext()
  const transformContext = useTransformContext()
  const transform = vec.matrixMult(pixelMatrix, transformContext)
  const segment = vec.scale(vec.normalize(vec.sub(point2, point1)), 100000)

  const scaledPoint1 = vec.transform(vec.sub(point1, segment), transform)
  const scaledPoint2 = vec.transform(vec.add(point2, segment), transform)

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
