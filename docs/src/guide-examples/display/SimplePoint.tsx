import * as React from "react"
import { Mafs, Point, CartesianCoordinates } from "mafs"

export default function SimplePoint() {
  return (
    <Mafs height={500}>
      <CartesianCoordinates />
      <Point x={1} y={1} />
    </Mafs>
  )
}
