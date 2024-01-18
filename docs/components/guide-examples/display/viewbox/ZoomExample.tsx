"use client"

import { Mafs, Coordinates, Circle, Text } from "mafs"

export default function ZoomExample() {
  return (
    <Mafs
      zoom={{ min: 0.1, max: 2 }}
      viewBox={{
        x: [-0.25, 0.25],
        y: [-0.25, 0.25],
        padding: 0,
      }}
      height={400}
    >
      <Coordinates.Cartesian subdivisions={5} />
      <Circle center={[0, 0]} radius={1} />
      <Text x={1.1} y={0.1} attach="ne">
        Oh hi!
      </Text>
    </Mafs>
  )
}
