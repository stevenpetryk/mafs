import React, { useState } from "react"
import {
  Mafs,
  CartesianCoordinates,
  FunctionGraph,
  Theme,
} from "mafs"

export default function Parametric() {
  const [a, setA] = useState(0)

  return (
    <>
      <Mafs height={300} xAxisExtent={[-8, 8]}>
        <CartesianCoordinates />
        <FunctionGraph.Parametric
          xy={(t) => [t, Math.sin(t * a)]}
          t={[-10, 10]}
          color={Theme.blue}
        />
      </Mafs>
      <input
        type="range"
        min={0}
        max={50}
        value={a}
        onChange={(event) => setA(+event.target.value)}
      />
    </>
  )
}
