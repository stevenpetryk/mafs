"use client"

import {
  Mafs,
  CartesianCoordinates,
  FunctionGraph,
  labelPi,
  useMovablePoint,
} from "mafs"

export default function HelloFx() {
  const phase = useMovablePoint([0, 0], {
    constrain: "horizontal",
  })

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
      <FunctionGraph.OfX y={(x) => Math.sin(x - phase.x)} />
      {phase.element}
    </Mafs>
  )
}
