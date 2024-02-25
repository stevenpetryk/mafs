"use client"

import { Mafs, Coordinates } from "mafs"

export default function Example() {
  return (
    <Mafs height={300}>
      <Coordinates.Cartesian />
    </Mafs>
  )
}
