"use client"

import { Mafs, Coordinates, Polygon } from "mafs"

export default function ViewboxEample() {
  return (
    <Mafs
      viewBox={{ x: [-5, 5], y: [-5, 5] }}
      height={400}
      zoom={{ min: 10, max: 1 }}
    >
      <Coordinates.Cartesian subdivisions={10} />
      {/* prettier-ignore */}
      <Polygon points={[[-5, -5], [5, -5], [5, 5], [-5, 5]]} />
    </Mafs>
  )
}
