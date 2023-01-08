"use client"

import {
  Mafs,
  CartesianCoordinates,
  Plot,
  Theme,
} from "mafs"

export default function FunctionsOfXAndY() {
  const sigmoid1 = (x: number) => 2 / (1 + Math.exp(-x)) - 1

  return (
    <Mafs height={300}>
      <CartesianCoordinates />
      <Plot.OfX y={Math.sin} color={Theme.blue} />
      <Plot.OfY x={sigmoid1} color={Theme.pink} />
    </Mafs>
  )
}
