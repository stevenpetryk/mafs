"use client"

import {
  Mafs,
  Line,
  CartesianCoordinates,
  useMovablePoint,
} from "mafs"

export default function LinePointAngleExample() {
  const point = useMovablePoint([0, 0])

  return (
    <Mafs height={200} viewBox={{ x: [-1, 1], y: [-1, 1] }}>
      <CartesianCoordinates />
      <Line.PointAngle
        point={point.point}
        angle={Math.PI / 6}
      />
      {point.element}
    </Mafs>
  )
}
