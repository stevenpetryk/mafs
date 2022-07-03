import * as React from "react"
import {
  Mafs,
  CartesianCoordinates,
  FunctionGraph,
} from "mafs"

export default function HelloFx() {
  return (
    <Mafs height={300}>
      <CartesianCoordinates subdivisions={4} />
      <FunctionGraph.OfX y={(x) => Math.sin(x)} />
    </Mafs>
  )
}
