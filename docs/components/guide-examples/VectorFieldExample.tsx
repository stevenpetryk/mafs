"use client"

import {
  Mafs,
  Plot,
  CartesianCoordinates,
  useMovablePoint,
} from "mafs"

function VectorFieldExample() {
  const a = useMovablePoint([0.6, 0.6])

  return (
    <Mafs>
      <CartesianCoordinates subdivisions={2} />
      <Plot.VectorField
        xy={([x, y]) => [
          y - a.y - (x - a.x),
          -(x - a.x) - (y - a.y),
        ]}
        step={0.5}
        xyOpacity={([x, y]) =>
          (Math.abs(x) + Math.abs(y)) / 10
        }
      />
      {a.element}
    </Mafs>
  )
}

export default VectorFieldExample
