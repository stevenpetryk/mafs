"use client"

import { Mafs, Coordinates } from "mafs"

export default function Example() {
  return (
    <Mafs height={300}>
      <Coordinates.Polar subdivisions={5} lines={2} />
    </Mafs>
  )
}
