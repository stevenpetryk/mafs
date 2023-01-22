"use client"

// prettier-ignore
import { Mafs, Ellipse, Circle, Coordinates, useMovablePoint, Theme, vec, Transform } from "mafs"

export default function MovableEllipse() {
  const hintRadius = 3

  // This center point translates everything else.
  const translate = useMovablePoint([0, 0], {
    color: Theme.orange,
  })

  // This outer point rotates the ellipse, and
  // is also translated by the center point.
  const rotate = useMovablePoint([hintRadius, 0], {
    color: Theme.blue,
    // Constrain this point to only move in a circle
    constrain: (position) =>
      vec.withMag(position, hintRadius),
  })
  const angle = Math.atan2(rotate.point[1], rotate.point[0])

  const width = useMovablePoint([-2, 0], {
    constrain: "horizontal",
  })
  const height = useMovablePoint([0, 1], {
    constrain: "vertical",
  })

  return (
    <Mafs height={400} viewBox={{ x: [-3, 3], y: [-3, 3] }}>
      <Coordinates.Cartesian />

      <Transform translate={translate.point}>
        <Transform rotate={angle}>
          {/*
           * Display a little hint that the
           * point is meant to move radially
           */}
          <Circle
            center={[0, 0]}
            radius={hintRadius}
            strokeStyle="dashed"
            strokeOpacity={0.3}
            fillOpacity={0}
          />

          <Ellipse
            center={[0, 0]}
            radius={[Math.abs(width.x), Math.abs(height.y)]}
          />

          {width.element}
          {height.element}
        </Transform>

        {rotate.element}
      </Transform>

      {translate.element}
    </Mafs>
  )
}
