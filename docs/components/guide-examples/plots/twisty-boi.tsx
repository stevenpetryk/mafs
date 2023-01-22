"use client"

import {
  Mafs,
  Coordinates,
  Plot,
  useMovablePoint,
} from "mafs"
import { clamp } from "lodash"

export default function TwistyBoi() {
  const point = useMovablePoint([0.5, 0], {
    constrain: ([x]) => [clamp(x, -1, 1), 0],
  })

  const k = point.x * 25 * Math.PI

  return (
    <Mafs height={300} viewBox={{ x: [-1, 1], y: [-1, 1] }}>
      <Coordinates.Cartesian subdivisions={4} />

      <Plot.Parametric
        t={[0, k]}
        xy={(t) => [Math.cos(t), (t / k) * Math.sin(t)]}
      />

      {point.element}
    </Mafs>
  )
}
