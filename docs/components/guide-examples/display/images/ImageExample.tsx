"use client"

import {
  Mafs,
  Image,
  Coordinates,
  useMovablePoint,
} from "mafs"

import image from "./mafs.png"

export default function ImageExample() {
  const origin = useMovablePoint([1, 1])

  return (
    <Mafs viewBox={{ x: [-1, 7], y: [-1, 5] }}>
      <Coordinates.Cartesian />
      <Image
        href={image.src ?? image}
        anchor="bl"
        x={origin.x}
        y={origin.y}
        width={2}
        height={2}
      />
      {origin.element}
    </Mafs>
  )
}
