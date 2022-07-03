import * as React from "react"
import { Mafs, CartesianCoordinates } from "mafs"

export default function HelloFx() {
  return (
    <Mafs height={300}>
      <CartesianCoordinates subdivisions={4} />
    </Mafs>
  )
}
