"use client"

import {
  Mafs,
  CartesianCoordinates,
  FunctionGraph,
  Theme,
} from "mafs"

export default function HelloFx() {
  return (
    <div>
      <Mafs height={300} viewBox={{ y: [-5, 5] }}>
        <CartesianCoordinates subdivisions={2} />
        <FunctionGraph.Parametric
          xy={(t) => [t, Math.tan(t)]}
          t={[-10, 10]}
          minimumSamplingDepth={12}
          color={Theme.blue}
          weight={1}
        />
      </Mafs>
    </div>
  )
}
