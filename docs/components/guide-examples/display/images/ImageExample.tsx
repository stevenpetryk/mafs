"use client"

import { Coordinates, Image, Mafs } from "mafs"

import mafs from "./mafs.png"

export default function VectorExample() {
  return (
    <Mafs viewBox={{ x: [-1, 7], y: [-1, 5] }}>
      <Coordinates.Cartesian />
      <Image
        src={mafs.src}
        anchor="cc"
        x={2}
        y={2}
        width={2}
        height={2}
      />
    </Mafs>
  )
}
