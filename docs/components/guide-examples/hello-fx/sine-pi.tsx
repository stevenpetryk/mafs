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
      yAxisExtent={[-2.5, 2.5]}
      xAxisExtent={[-15, 15]}
    >
      <CartesianCoordinates
        subdivisions={4}
        xAxis={{ lines: Math.PI, labels: labelPi }}
      />
      <FunctionGraph.OfX y={(x) => Math.sin(x)} />
    </Mafs>
  )
}
