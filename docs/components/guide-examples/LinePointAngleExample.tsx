"use client"

import {
  Mafs,
  Line,
  CartesianCoordinates,
  useMovablePoint,
} from "mafs"

export default function LinePointAngleExample() {
  const point = useMovablePoint([-1, -1])

  return (
    <Mafs>
      <CartesianCoordinates />
      <Line.PointAngle
        point={point.point}
        angle={Math.PI / 6}
      />
      {point.element}
    </Mafs>
  )
}
