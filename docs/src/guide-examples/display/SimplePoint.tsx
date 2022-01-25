// @example_height 500
import React from "react"
import { Mafs, Point, CartesianCoordinates } from "mafs"

export default function SimplePoint() {
  return (
    <Mafs>
      <CartesianCoordinates />
      <Point x={1} y={1} />
    </Mafs>
  )
}
