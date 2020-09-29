import React from "react"
import {
  Mafs,
  Theme,
  Polygon,
  CartesianCoordinates,
  useMovablePoint,
} from "mafs"

export default function SimplePoint() {
  const a = [2, 0]
  const b = [-2, 0]
  const c = useMovablePoint([0, 2])

  return (
    <Mafs height={500}>
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
