"use client"

import { Mafs, CartesianCoordinates, Plot } from "mafs"

export default function HelloFx() {
  return (
    <Mafs height={300}>
      <CartesianCoordinates subdivisions={4} />
      <Plot.OfX y={(x) => Math.sin(x)} />
    </Mafs>
  )
}
