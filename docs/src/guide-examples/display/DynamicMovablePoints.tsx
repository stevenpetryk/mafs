import React from "react"
// prettier-ignore
import { Mafs, CartesianCoordinates, MovablePoint, Vector2, useMovablePoint, Line, Theme } from "mafs"
import * as vec from "vec-la"

export default function DynamicMovablePoints() {
  const startPoint = useMovablePoint([-3, -1])
  const endPoint = useMovablePoint([3, 1])

  const length = vec.dist(startPoint.point, endPoint.point)
  const numPointsInBetween = length

  function shift(shiftBy: Vector2) {
    startPoint.setPoint(vec.add(startPoint.point, shiftBy))
    endPoint.setPoint(vec.add(endPoint.point, shiftBy))
  }

  return (
    <Mafs>
      <CartesianCoordinates />

      <Line.Segment
        point1={startPoint.point}
        point2={endPoint.point}
      />

      {new Array(Math.round(numPointsInBetween))
        .fill(0)
        .map((_, i) => {
          if (i === 0 || i === numPointsInBetween)
            return null

          const point = vec.towards(
            startPoint.point,
            endPoint.point,
            i / numPointsInBetween
          )
          return (
            <MovablePoint
              key={i}
              point={point}
              color={Theme.blue}
              onMove={(newPoint) => {
                shift(vec.sub(newPoint, point))
              }}
            />
          )
        })}

      {startPoint.element}
      {endPoint.element}
    </Mafs>
  )
}
