"use client"

import {
  Mafs,
  Theme,
  Polygon,
  Coordinates,
  useMovablePoint,
} from "mafs"

export default function TrianglePool() {
  const a = [-2, -2] as [number, number]
  const b = useMovablePoint([-1, 1])
  const c = useMovablePoint([1, -1])
  const d = [2, 2] as [number, number]

  return (
    <Mafs height={300}>
      <Coordinates.Cartesian />
      <Polygon
        points={[a, b.point, c.point, d]}
        shapeType="open"
        color={Theme.blue}
      />
      {b.element}
      {c.element}
    </Mafs>
  )
}
