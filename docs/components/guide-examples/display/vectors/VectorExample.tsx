"use client"

// prettier-ignore
import { Mafs, Coordinates, useMovablePoint, Vector, vec } from "mafs"

export default function VectorExample() {
  const tip = useMovablePoint([0.4, 0.6])

  const vec1 = tip.point
  const angle = Math.atan2(tip.y, tip.x)
  const vec2 = vec.add(vec1, vec.rotate(vec1, angle))
  const vec3 = vec.add(vec1, vec.rotate(vec2, -2 * angle))

  return (
    <Mafs>
      <Coordinates.Cartesian />
      <Vector tip={vec1} />
      <Vector tail={vec1} tip={vec2} />
      <Vector tail={vec2} tip={vec3} />

      {tip.element}
    </Mafs>
  )
}
