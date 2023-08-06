"use client"

// prettier-ignore
import { Mafs, Coordinates, MovablePoint, useMovablePoint, Line, Theme, vec } from "mafs"
import range from "lodash/range"

export default function DynamicMovablePoints() {
  const start = useMovablePoint([-3, -1])
  const end = useMovablePoint([3, 1])

  function shift(shiftBy: vec.Vector2) {
    start.setPoint(vec.add(start.point, shiftBy))
    end.setPoint(vec.add(end.point, shiftBy))
  }

  const length = vec.dist(start.point, end.point)
  const betweenPoints = range(1, length - 0.5, 1).map((t) =>
    vec.lerp(start.point, end.point, t / length),
  )

  return (
    <Mafs>
      <Coordinates.Cartesian />

      <Line.Segment
        point1={start.point}
        point2={end.point}
      />

      {start.element}
      {betweenPoints.map((point, i) => (
        <MovablePoint
          key={i}
          point={point}
          color={Theme.blue}
          onMove={(newPoint) => {
            shift(vec.sub(newPoint, point))
          }}
        />
      ))}
      {end.element}
    </Mafs>
  )
}
