import * as React from "react"
import {
  Mafs,
  CartesianCoordinates,
  FunctionGraph,
  Theme,
} from "mafs"

export default function Parametric() {
  return (
    <Mafs height={300} xAxisExtent={[-8, 8]}>
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
