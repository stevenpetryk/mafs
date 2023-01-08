"use client"

import { CartesianCoordinates, Mafs, Plot } from "mafs"

const fn = (x: number) => Math.sin(1 / x)
export default function SineStressTest() {
  return (
    <Mafs
      height={300}
      // prettier-ignore
      viewBox={{ x: [-0.25, 0.25], y: [-3.5, 3.5], padding: 0 }}
      preserveAspectRatio={false}
    >
      <CartesianCoordinates />
      <Plot.OfX y={(x) => fn(x) + 1.5} />
      {/* prettier-ignore */}
      <Plot.OfX y={(x) => fn(x) - 1.5} minSamplingDepth={15} />
    </Mafs>
  )
}
