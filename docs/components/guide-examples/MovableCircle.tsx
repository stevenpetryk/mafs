"use client"

import {
  Mafs,
  Circle,
  Coordinates,
  useMovablePoint,
  vec,
} from "mafs"

export default function MovableCircle() {
  const pointOnCircle = useMovablePoint([
    Math.sqrt(2) / 2,
    Math.sqrt(2) / 2,
  ])
  const r = vec.mag(pointOnCircle.point)

  return (
    <Mafs height={200} viewBox={{ y: [-2, 2] }}>
      <Coordinates.Cartesian />
      <Circle center={[0, 0]} radius={r} />
      {pointOnCircle.element}
    </Mafs>
  )
}
