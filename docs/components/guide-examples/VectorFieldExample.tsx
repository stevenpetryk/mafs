"use client"

import {
  Mafs,
  Plot,
  CartesianCoordinates,
  useMovablePoint,
  vec,
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
          vec.dist([x, y], a.point) / 5 - 0.1
        }
      />
      {a.element}
    </Mafs>
  )
}

export default VectorFieldExample
