"use client"

// prettier-ignore
import { Mafs, Ellipse, Circle, CartesianCoordinates, useMovablePoint, Theme, vec, Group } from "mafs"

export default function MovableEllipse() {
  const hintRadius = 3

  // This center point translates everything else.
  const center = useMovablePoint([0, 0], {
    color: Theme.orange,
  })

  // This outer point rotates the ellipse, and
  // is also translated by the center point.
  const rotate = useMovablePoint([hintRadius, 0], {
    color: Theme.blue,
    // Constrain this point to only move in a circle
    constrain: (position) =>
      vec.scale(vec.normalize(position), hintRadius),
  })
  const angle = Math.atan2(rotate.point[1], rotate.point[0])

  const width = useMovablePoint([-2, 0], {
    constrain: "horizontal",
  })
  const height = useMovablePoint([0, 1], {
    constrain: "vertical",
  })

  return (
    <Mafs height={500}>
      <CartesianCoordinates />

      {/*
       * Display a little hint that the
       * point is meant to move radially
       */}
      <Circle
        center={center.point}
        radius={hintRadius}
        strokeStyle="dashed"
        strokeOpacity={0.3}
        fillOpacity={0}
      />

      <Ellipse
        center={center.point}
        radius={[Math.abs(width.x), Math.abs(height.y)]}
        angle={angle}
      />

      {center.element}

      <Group rotate={angle} translate={center.point}>
        {width.element}
        {height.element}
      </Group>

      <Group translate={center.point}>
        {rotate.element}
      </Group>
    </Mafs>
  )
}
