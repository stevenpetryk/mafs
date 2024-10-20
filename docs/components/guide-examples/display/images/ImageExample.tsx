"use client"

import {
  Coordinates,
  Image,
  Mafs,
  useMovablePoint,
} from "mafs"

import image from "./mafs.png"

export default function ImageExample() {
  const origin = useMovablePoint([3, 3])
  const padding = 0.1

  return (
    <Mafs viewBox={{ x: [-1, 7], y: [-1, 5] }}>
      <Coordinates.Cartesian />
      <Image
        href={image.src ?? image}
        anchor="tl"
        x={origin.x + padding}
        y={origin.y - padding}
        width={2}
        height={2}
      />
      <Image
        href={image.src ?? image}
        anchor="tr"
        x={origin.x - padding}
        y={origin.y - padding}
        width={2}
        height={2}
      />
      <Image
        href={image.src ?? image}
        anchor="bl"
        x={origin.x + padding}
        y={origin.y + padding}
        width={2}
        height={2}
      />
      <Image
        href={image.src ?? image}
        anchor="br"
        x={origin.x - padding}
        y={origin.y + padding}
        width={2}
        height={2}
      />
      {origin.element}
    </Mafs>
  )
}
