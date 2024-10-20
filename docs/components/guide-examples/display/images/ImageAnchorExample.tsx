"use client"

import {
  Coordinates,
  Image,
  Mafs,
  useMovablePoint,
} from "mafs"

import mafs from "./mafs.png"

export default function VectorExample() {
  const center = useMovablePoint([2, 2])
  return (
    <Mafs viewBox={{ x: [-1, 7], y: [-1, 5] }}>
      <Coordinates.Cartesian />
      <Image
        src={mafs.src}
        anchor="tl"
        x={center.x + 0.1}
        y={center.y - 0.1}
        width={1}
        height={1}
      />
      <Image
        src={mafs.src}
        anchor="tr"
        x={center.x - 0.1}
        y={center.y - 0.1}
        width={1}
        height={1}
      />
      <Image
        src={mafs.src}
        anchor="bl"
        x={center.x + 0.1}
        y={center.y + 0.1}
        width={1}
        height={1}
      />
      <Image
        src={mafs.src}
        anchor="br"
        x={center.x - 0.1}
        y={center.y + 0.1}
        width={1}
        height={1}
      />
      {center.element}
    </Mafs>
  )
}
