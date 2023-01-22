"use client"

// prettier-ignore
import { Mafs, Coordinates, Text, useMovablePoint } from "mafs"

export default function VectorExample() {
  const point = useMovablePoint([1, 1])

  return (
    <Mafs height={200} viewBox={{ y: [0, 2], x: [-3, 5] }}>
      <Coordinates.Cartesian />
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
