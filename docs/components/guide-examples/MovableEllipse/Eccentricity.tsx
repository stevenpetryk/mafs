"use client"

// prettier-ignore
import { Mafs, Ellipse, Coordinates, useMovablePoint, Theme, vec, Transform } from "mafs"
import { useEffect } from 'react'
import clamp from 'lodash/clamp'

export default function MovableEllipse() {
  const focus1 = useMovablePoint([-Math.sqrt(3),0], {
    color: Theme.orange,
  })
  const focus2 = useMovablePoint([ Math.sqrt(3),0], {
    color: Theme.orange,
  })
  const eccentricity = useMovablePoint([6,Math.sqrt(3)/2], {
    constrain: (position) => [6,clamp(position[1],0,1)]
  })

  return (
    <Mafs height={400} viewBox={{ x: [-3, 3], y: [-3, 3] }}>
      <Coordinates.Cartesian/>
      <Ellipse.Eccentricity
        focus1={focus1.point}
        focus2={focus2.point}
        eccentricity={eccentricity.point[1]}
      />
      {focus1.element}
      {focus2.element}
      {eccentricity.element}
    </Mafs>
  )
}

