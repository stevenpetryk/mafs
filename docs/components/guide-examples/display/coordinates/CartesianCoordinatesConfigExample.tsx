"use client"

import { Mafs, Coordinates, labelPi } from "mafs"

export default function CartesianCoordinatesExample() {
  return (
    <Mafs
      height={200}
      // prettier-ignore
      viewBox={{ x: [-8, 8], y: [-Math.PI * 2, Math.PI * 2], padding: Math.PI / 2, }}
      preserveAspectRatio={false}
    >
      <Coordinates.Cartesian
        xAxis={{
          lines: 1,
          labels: (n) => (isOdd(n) ? n : ""),
        }}
        yAxis={{
          lines: Math.PI,
          subdivisions: 4,
          labels: labelPi,
        }}
      />
    </Mafs>
  )
}

function isOdd(n: number) {
  return ((n % 2) + 2) % 2 === 0
}
