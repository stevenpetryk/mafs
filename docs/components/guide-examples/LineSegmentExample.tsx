"use client"

import {
  Mafs,
  Line,
  Coordinates,
  useMovablePoint,
} from "mafs"

export default function LineSegmentExample() {
  const point1 = useMovablePoint([-2, -1])
  const point2 = useMovablePoint([2, 1])

  return (
    <Mafs height={200} viewBox={{ x: [-2, 2], y: [-1, 1] }}>
      <Coordinates.Cartesian />
      <Line.Segment
        point1={point1.point}
        point2={point2.point}
      />
      {point1.element}
      {point2.element}
    </Mafs>
  )
}
