"use client"

import { Mafs, Coordinates, Plot, Theme } from "mafs"

export default function Expressions() {
  return (
    <Mafs height={300} viewBox={{ x: [-4, 4], y: [-3, 3] }}>
      <Coordinates.Cartesian />
      <Plot.OfX y="tan(x)" color={Theme.blue} />
      <Plot.OfX y="floor(x) / 2" color={Theme.green} />
      <Plot.OfX
        y="(x^2 - 1) / (x - 1) - 3"
        color={Theme.pink}
      />
      <Plot.OfX y="sin(1/x) - 2" color={Theme.orange} />
    </Mafs>
  )
}
