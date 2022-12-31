"use client"

import * as React from "react"
// prettier-ignore
import { Mafs, CartesianCoordinates, Text, useMovablePoint } from "mafs"

export default function VectorExample() {
  const point = useMovablePoint([1, 1])

  return (
    <Mafs>
      <CartesianCoordinates />
      <Text
        x={point.x}
        y={point.y}
        attach="w"
        attachDistance={15}
      >
        ({point.x.toFixed(3)}, {point.y.toFixed(3)})
      </Text>
      <Text
        x={point.x}
        y={point.y}
        attach="e"
        attachDistance={15}
      >
        ({point.x.toFixed(3)}, {point.y.toFixed(3)})
      </Text>
      {point.element}
    </Mafs>
  )
}
