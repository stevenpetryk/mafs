// @example_height 300
import React from "react"
import {
  Mafs,
  CartesianCoordinates,
  FunctionGraph,
} from "mafs"

export default function HelloFx() {
  return (
    <Mafs>
      <CartesianCoordinates subdivisions={4} />
      <FunctionGraph.OfX y={(x) => Math.sin(x)} />
    </Mafs>
  )
}
