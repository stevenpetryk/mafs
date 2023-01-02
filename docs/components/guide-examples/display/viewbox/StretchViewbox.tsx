"use client"

import { Mafs, CartesianCoordinates, Polygon } from "mafs"

export default function ViewboxEample() {
  return (
    <Mafs
      viewBox={{ x: [-5, 5], y: [-5, 5] }}
      preserveAspectRatio={false}
      height={400}
    >
      <CartesianCoordinates />
      {/* prettier-ignore */}
      <Polygon points={[[-5, -5], [5, -5], [5, 5], [-5, 5]]} />
    </Mafs>
  )
}
