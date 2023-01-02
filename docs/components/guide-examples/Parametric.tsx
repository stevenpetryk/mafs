"use client"

import {
  Mafs,
  CartesianCoordinates,
  FunctionGraph,
  Theme,
} from "mafs"

export default function Parametric() {
  return (
    <Mafs height={300} viewBox={{ x: [-4, 4], y: [-4, 4] }}>
      <CartesianCoordinates />
      <FunctionGraph.Parametric
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
