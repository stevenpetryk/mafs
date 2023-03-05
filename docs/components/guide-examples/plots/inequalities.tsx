"use client"

import {
  Mafs,
  Coordinates,
  Plot,
  Theme,
  useMovablePoint,
} from "mafs"

export default function InequalitiesExample() {
  const a = useMovablePoint([0, -1])

  return (
    <Mafs height={300}>
      <Coordinates.Cartesian />

      <Plot.Inequality
        x={{
          "<=": (y) => Math.cos(y + a.y) - a.x,
          ">": (y) => Math.sin(y - a.y) + a.x,
        }}
        color={Theme.blue}
      />

      {a.element}
    </Mafs>
  )
}
