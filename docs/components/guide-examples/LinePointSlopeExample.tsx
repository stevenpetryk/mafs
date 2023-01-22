"use client"

import {
  Mafs,
  Line,
  Coordinates,
  useMovablePoint,
} from "mafs"

export default function LinePointSlopeExample() {
  const point = useMovablePoint([-1, -1])
  const slope = useMovablePoint([0, 1], {
    constrain: "vertical",
  })

  return (
    <Mafs height={200} viewBox={{ x: [-1, 1], y: [-1, 1] }}>
      <Coordinates.Cartesian />
      <Line.PointSlope
        point={point.point}
        slope={slope.y}
      />
      {point.element}
      {slope.element}
    </Mafs>
  )
}
