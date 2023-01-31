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
        y={{
          "<=": (x) => Math.cos(x + a.x) - a.y,
          ">": (x) => Math.sin(x - a.x) + a.y,
        }}
        color={Theme.blue}
      />

      {a.element}
    </Mafs>
  )
}
