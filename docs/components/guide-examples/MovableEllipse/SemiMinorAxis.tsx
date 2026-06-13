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
  const semiMinorAxis = useMovablePoint([0,1], {
    constrain: (position) => {
      const a = focus1.point
      const b = focus2.point

      const ab = vec.sub(b, a)

      const mid = vec.midpoint(a,b)

      const perp = vec.normal(ab)

      const denom = vec.dot(perp, perp)
      if (denom === 0) return [...mid]

      const ap = vec.sub(position, mid)

      const t = vec.dot(ap, perp) / denom

      return vec.add(mid, vec.scale(perp, t))
    }
  })
  const sma = vec.dist(semiMinorAxis.point,vec.midpoint(focus1.point,focus2.point))

  return (
    <Mafs height={400} viewBox={{ x: [-3, 3], y: [-3, 3] }}>
      <Coordinates.Cartesian/>
      <Ellipse.SemiMinorAxis
        focus1={focus1.point}
        focus2={focus2.point}
        semiMinorAxis={sma}
      />
      {focus1.element}
      {focus2.element}
      {semiMinorAxis.element}
    </Mafs>
  )
}

