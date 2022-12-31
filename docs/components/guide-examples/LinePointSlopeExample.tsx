"use client"

import * as React from "react"
import {
  Mafs,
  Line,
  CartesianCoordinates,
  useMovablePoint,
} from "mafs"

export default function LinePointSlopeExample() {
  const point = useMovablePoint([-1, -1])
  const slope = useMovablePoint([0, 1], {
    constrain: "vertical",
  })

  return (
    <Mafs>
      <CartesianCoordinates />
      <Line.PointSlope
        point={point.point}
        slope={slope.y}
      />
      {point.element}
      {slope.element}
    </Mafs>
  )
}
