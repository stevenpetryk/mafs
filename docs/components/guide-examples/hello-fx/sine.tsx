"use client"

import { Mafs, Coordinates, Plot } from "mafs"

export default function HelloFx() {
  return (
    <Mafs height={300}>
      <Coordinates.Cartesian subdivisions={4} />
      <Plot.OfX y={(x) => Math.sin(x)} />
    </Mafs>
  )
}
