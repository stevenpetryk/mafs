"use client"

import {
  CartesianCoordinates,
  Plot,
  Mafs,
  Transform,
  useMovablePoint,
} from "mafs"

export default function FancyParabola() {
  const a = useMovablePoint([-1, 0], {
    constrain: "horizontal",
  })
  const b = useMovablePoint([1, 0], {
    constrain: "horizontal",
  })

  const k = useMovablePoint([0, -1], {
    constrain: "vertical",
  })

  const mid = (a.x + b.x) / 2
  const fn = (x: number) => (x - a.x) * (x - b.x)

  return (
    <Mafs>
      <CartesianCoordinates subdivisions={2} />

      <Plot.OfX y={(x) => (k.y * fn(x)) / fn(mid)} />
      {a.element}
      {b.element}
      <Transform translate={[(a.x + b.x) / 2, 0]}>
        {k.element}
      </Transform>
    </Mafs>
  )
}
