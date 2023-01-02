"use client"

import { Mafs, Point, CartesianCoordinates } from "mafs"

export default function SimplePoint() {
  return (
    <Mafs height={300}>
      <CartesianCoordinates />
      <Point x={1} y={1} />
    </Mafs>
  )
}
