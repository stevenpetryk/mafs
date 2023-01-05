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
    <Mafs height={200} viewBox={{ y: [-1, 1] }}>
      <CartesianCoordinates />
      <Line.PointAngle
        point={point.point}
        angle={Math.PI / 6}
      />
      {point.element}
    </Mafs>
  )
}
