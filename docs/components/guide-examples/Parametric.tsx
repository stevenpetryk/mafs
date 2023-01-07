"use client"

import {
  Mafs,
  CartesianCoordinates,
  Plot,
  Theme,
} from "mafs"

export default function Parametric() {
  return (
    <Mafs height={300} viewBox={{ x: [-3, 3], y: [-3, 3] }}>
      <CartesianCoordinates />
      <Plot.Parametric
        xy={(t) => [
          (t / 4) * Math.cos(t * 2 * Math.PI),
          (t / 4) * Math.sin(t * 2 * Math.PI),
        ]}
        t={[0, 8]}
        color={Theme.blue}
      />
    </Mafs>
  )
}
