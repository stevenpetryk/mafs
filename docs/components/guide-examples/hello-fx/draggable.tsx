"use client"

import {
  Mafs,
  Coordinates,
  Plot,
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
      viewBox={{ x: [-10, 10], y: [-2, 2] }}
      preserveAspectRatio={false}
    >
      <Coordinates.Cartesian
        subdivisions={4}
        xAxis={{ lines: Math.PI, labels: labelPi }}
      />
      <Plot.OfX y={(x) => Math.sin(x - phase.x)} />
      {phase.element}
    </Mafs>
  )
}
