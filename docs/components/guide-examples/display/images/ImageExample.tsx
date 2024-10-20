"use client"

import {
  Coordinates,
  Debug,
  Image,
  Mafs,
  useMovablePoint,
} from "mafs"

import mafs from "./mafs.png"

export default function ImageExample() {
  const origin = useMovablePoint([3, 3])
  const padding = 0.1

  return (
    <Mafs viewBox={{ x: [-1, 7], y: [-1, 5] }}>
      <Coordinates.Cartesian />
      <Image
        src={mafs.src}
        anchor="tl"
        x={origin.x + padding}
        y={origin.y - padding}
        width={2}
        height={2}
      />
      <Image
        src={mafs.src}
        anchor="tr"
        x={origin.x - padding}
        y={origin.y - padding}
        width={2}
        height={2}
      />
      <Image
        src={mafs.src}
        anchor="bl"
        x={origin.x + padding}
        y={origin.y + padding}
        width={2}
        height={2}
      />
      <Image
        src={mafs.src}
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
