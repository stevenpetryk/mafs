"use client"

import {
  Mafs,
  Theme,
  Polygon,
  CartesianCoordinates,
  useMovablePoint,
} from "mafs"

export default function SimplePoint() {
  const a = [2, 0] as [number, number]
  const b = [-2, 0] as [number, number]
  const c = useMovablePoint([0, 2])

  return (
    <Mafs height={300}>
      <CartesianCoordinates />
      <Polygon
        points={[[c.x, -c.y], a, b]}
        strokeStyle="dashed"
      />
      <Polygon
        points={[c.point, a, b]}
        color={Theme.blue}
      />
      {c.element}
    </Mafs>
  )
}
