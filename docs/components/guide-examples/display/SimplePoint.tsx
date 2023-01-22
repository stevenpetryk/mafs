"use client"

import { Mafs, Point, Coordinates } from "mafs"

export default function SimplePoint() {
  return (
    <Mafs height={300}>
      <Coordinates.Cartesian />
      <Point x={1} y={1} />
    </Mafs>
  )
}
