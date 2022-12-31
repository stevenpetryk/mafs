"use client"

import {
  Mafs,
  Circle,
  CartesianCoordinates,
  useMovablePoint,
} from "mafs"
import * as vec from "vec-la"

export default function MovableCircle() {
  const pointOnCircle = useMovablePoint([
    Math.sqrt(2) / 2,
    Math.sqrt(2) / 2,
  ])
  const r = vec.mag(pointOnCircle.point)

  return (
    <Mafs height={500}>
      <CartesianCoordinates />
      <Circle center={[0, 0]} radius={r} />
      {pointOnCircle.element}
    </Mafs>
  )
}
