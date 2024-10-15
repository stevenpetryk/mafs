"use client"

import { Coordinates, Mafs, Text } from "mafs"

export default function Home() {
  return (
    <div>
      <Mafs>
        <Coordinates.Cartesian />
        <Text x={0} y={0}>
          Mafs is working!
        </Text>
      </Mafs>
    </div>
  )
}
