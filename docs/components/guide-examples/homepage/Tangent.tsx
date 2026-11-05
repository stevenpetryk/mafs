"use client"

import {
  Mafs,
  Coordinates,
  Plot,
  Line,
  Point,
  Theme,
  useMovablePoint,
} from "mafs"

export default function Tangent() {
  const f = (x: number) => Math.sin(x) + x / 3
  const df = (x: number) => Math.cos(x) + 1 / 3

  const p = useMovablePoint([1, f(1)], {
    constrain: ([x]) => [x, f(x)],
  })

  return (
    <Mafs height={360} viewBox={{ x: [-6, 6], y: [-3, 3] }}>
      <Coordinates.Cartesian subdivisions={2} />
      <Plot.OfX y={f} />
      <Line.PointSlope
        point={p.point}
        slope={df(p.x)}
        color={Theme.orange}
      />
      <Point x={p.x} y={0} opacity={0.5} />
      {p.element}
    </Mafs>
  )
}
