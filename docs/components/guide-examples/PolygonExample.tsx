"use client"

import {
  Mafs,
  Theme,
  Polygon,
  Coordinates,
  useMovablePoint,
} from "mafs"

export default function TrianglePool() {
  const a = [2, 0] as [number, number]
  const b = [-2, 0] as [number, number]
  const c = useMovablePoint([0, 2])

  return (
    <Mafs height={300}>
      <Coordinates.Cartesian />
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
