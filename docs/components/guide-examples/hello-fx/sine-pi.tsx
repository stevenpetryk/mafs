"use client"

import { Mafs, Coordinates, Plot, labelPi } from "mafs"

export default function HelloFx() {
  return (
    <Mafs
      height={300}
      viewBox={{ x: [-10, 10], y: [-2, 2] }}
      preserveAspectRatio={false}
    >
      <Coordinates.Cartesian
        subdivisions={4}
        xAxis={{ lines: Math.PI, labels: labelPi }}
      />
      <Plot.OfX y={(x) => Math.sin(x)} />
    </Mafs>
  )
}
