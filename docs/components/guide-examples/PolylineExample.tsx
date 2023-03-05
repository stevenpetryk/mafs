"use client"

import {
  Mafs,
  Theme,
  Polyline,
  Coordinates,
  useMovablePoint,
} from "mafs"

export default function LightningBolt() {
  const a = [-2, -2] as [number, number]
  const b = useMovablePoint([-1, 1])
  const c = useMovablePoint([1, -1])
  const d = [2, 2] as [number, number]

  return (
    <Mafs height={300}>
      <Coordinates.Cartesian />
      <Polyline
        points={[a, b.point, c.point, d]}
        color={Theme.blue}
      />
      {b.element}
      {c.element}
    </Mafs>
  )
}
