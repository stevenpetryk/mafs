// @example_height 300
import React from "react"
import { Mafs, CartesianCoordinates } from "mafs"

export default function HelloFx() {
  return (
    <Mafs>
      <CartesianCoordinates subdivisions={4} />
    </Mafs>
  )
}
