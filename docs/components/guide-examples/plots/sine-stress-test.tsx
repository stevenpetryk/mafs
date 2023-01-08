"use client"

import { Mafs, Plot } from "mafs"

export default function SineStressTest() {
  return (
    <Mafs
      height={300}
      // prettier-ignore
      viewBox={{ x: [-0.25, 0.25], y: [-3.5, 3.5], padding: 0 }}
      preserveAspectRatio={false}
      pan={false}
    >
      <Plot.Parametric
        t={[-2, 2]}
        xy={(t) => [t, 1.5 + Math.sin(1 / t)]}
      />

      <Plot.Parametric
        t={[-2, 2]}
        xy={(t) => [t, -1.5 + Math.sin(1 / t)]}
        minimumSamplingDepth={13}
      />
    </Mafs>
  )
}
