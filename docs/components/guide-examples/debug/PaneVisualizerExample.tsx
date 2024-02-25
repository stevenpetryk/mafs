"use client"

import { Mafs, Coordinates, Debug } from "mafs"

export default function Example() {
  return (
    <Mafs viewBox={{ x: [-1, 1], y: [-1, 1] }}>
      <Coordinates.Cartesian />
      <Debug.ViewportInfo />
    </Mafs>
  )
}
