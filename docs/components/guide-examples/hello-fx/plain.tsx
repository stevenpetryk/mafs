"use client"

import { Mafs, Coordinates } from "mafs"

export default function HelloFx() {
  return (
    <Mafs height={300}>
      <Coordinates.Cartesian />
    </Mafs>
  )
}
