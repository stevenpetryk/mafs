"use client"

import {
  Mafs,
  CartesianCoordinates,
  FunctionGraph,
  labelPi,
} from "mafs"

export default function HelloFx() {
  return (
    <Mafs
      height={300}
      viewBox={{ x: [-10, 10], y: [-2, 2] }}
      preserveAspectRatio={false}
    >
      <CartesianCoordinates
        subdivisions={4}
        xAxis={{ lines: Math.PI, labels: labelPi }}
      />
      <FunctionGraph.OfX y={(x) => Math.sin(x)} />
    </Mafs>
  )
}
