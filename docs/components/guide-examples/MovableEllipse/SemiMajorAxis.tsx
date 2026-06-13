"use client"

// prettier-ignore
import { Mafs, Ellipse, Coordinates, useMovablePoint, Theme, vec, Transform } from "mafs"
import { useEffect } from 'react'

export default function MovableEllipse() {
  const focus1 = useMovablePoint([-Math.sqrt(3),0], {
    color: Theme.orange,
  })
  const focus2 = useMovablePoint([ Math.sqrt(3),0], {
    color: Theme.orange,
  })
  const semiMajorAxis = useMovablePoint([-2,0], {
    constrain: (position) => {
      const a1 = focus1.point
      const a2 = focus2.point

      const ab = vec.sub(a2, a1)
      const ap = vec.sub(position, a1)

      const len2 = vec.dot(ab, ab)
      if (len2 == 0) return [...a1]

      const t = vec.dot(ap, ab) / len2

      return vec.add(a1, vec.scale(ab, t))
    }
  })
  const sma = vec.dist(semiMajorAxis.point,vec.midpoint(focus1.point,focus2.point))

  return (
    <Mafs height={400} viewBox={{ x: [-3, 3], y: [-3, 3] }}>
      <Coordinates.Cartesian/>
      <Ellipse.SemiMajorAxis
        focus1={focus1.point}
        focus2={focus2.point}
        semiMajorAxis={sma}
      />
      {focus1.element}
      {focus2.element}
      {semiMajorAxis.element}
    </Mafs>
  )
}
