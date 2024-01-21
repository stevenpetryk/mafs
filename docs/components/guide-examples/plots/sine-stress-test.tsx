"use client"

import { Coordinates, Mafs, Plot } from "mafs"

export default function SineStressTest() {
  const fn = (x: number) => Math.sin(1 / x)

  return (
    <Mafs
      height={300}
      // prettier-ignore
      viewBox={{ x: [-1/32, 1/32], y: [-3.5, 3.5], padding: 0 }}
      preserveAspectRatio={false}
    >
      <Coordinates.Cartesian />
      <Plot.OfX y={(x) => fn(x) + 1.5} weight={1} />
      {/* prettier-ignore */}
      <Plot.OfX y={(x) => fn(x) - 1.5} minSamplingDepth={16} weight={1} />
    </Mafs>
  )
}
