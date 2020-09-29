import React, { useEffect } from "react"
import {
  Mafs,
  Line,
  CartesianCoordinates,
  useMovablePoint,
  useStopwatch,
} from "mafs"

export default function LinePointAngleExample() {
  const point = useMovablePoint([-1, -1])
  const { time: angle, start } = useStopwatch()
  useEffect(() => start(), [start])

  return (
    <Mafs>
      <CartesianCoordinates />
      <Line.PointAngle point={point.point} angle={angle} />
      {point.element}
    </Mafs>
  )
}
