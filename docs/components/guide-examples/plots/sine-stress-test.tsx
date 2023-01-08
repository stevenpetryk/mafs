"use client"

import { CartesianCoordinates, Mafs, Plot } from "mafs"

export default function SineStressTest() {
  const fn = (x: number) => Math.sin(1 / x)

  return (
    <Mafs
      height={300}
      // prettier-ignore
      viewBox={{ x: [-0.25, 0.25], y: [-3.5, 3.5], padding: 0 }}
      preserveAspectRatio={false}
    >
      <CartesianCoordinates />
      <Plot.OfX y={(x) => fn(x) + 1.5} />
      <Plot.OfX
        y={(x) => fn(x) - 1.5}
        maxSamplingDepth={15}
      />
    </Mafs>
  )
}