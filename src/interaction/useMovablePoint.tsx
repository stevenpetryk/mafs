import React, { useRef } from "react"
import { useMemo, useState } from "react"
import MovablePoint from "./MovablePoint"
import * as vec from "vec-la"
import { theme } from "display/Theme"
import { Vector2 } from "../typings/math"
import invert from "gl-matrix-invert"

const identity = vec.matrixBuilder().get()

export type ConstraintFunction = (position: Vector2) => Vector2

export interface UseMovablePointArguments {
  color?: string

  /**
   * Transform the point's movement and constraints by a transformation matrix. You can use `vec-la`
   * to build up such a matrix.
   */
  transform?: vec.Matrix

  /**
   * Constrain the point to only horizontal movement, vertical movement, or mapped movement.
   *
   * In mapped movement mode, you must provide a function that maps the user's attempted position
   * (x, y) to the position the point should "snap" to.
   */
  constrain?: "horizontal" | "vertical" | ConstraintFunction
}

export interface UseMovablePoint {
  x: number
  y: number
  point: Vector2
  element: React.ReactElement
}

function useMovablePoint(
  [initialX, initialY]: Vector2,
  { constrain, color = theme.pink, transform = identity }: UseMovablePointArguments = {}
): UseMovablePoint {
  let constraintFunction: ConstraintFunction = ([x, y]) => [x, y]
  if (constrain === "horizontal") {
    constraintFunction = ([x]) => [x, initialY]
  } else if (constrain === "vertical") {
    constraintFunction = ([, y]) => [initialX, y]
  } else if (typeof constrain === "function") {
    constraintFunction = constrain
  }

  const [point, setPoint] = useState(() => constraintFunction([initialX, initialY]))
  const [x, y] = point
  const [displayX, displayY] = vec.transform(point, transform)

  const pickup = useRef<Vector2>([0, 0])

  const element = useMemo(() => {
    return (
      <MovablePoint
        x={displayX}
        y={displayY}
        color={color}
        onMovement={({ movement, first }) => {
          if (first) {
            pickup.current = vec.transform([x, y], transform)
          }
          setPoint(
            constraintFunction(
              vec.transform(vec.add(pickup.current, movement), getInverseTransform(transform))
            )
          )
        }}
      />
    )
  }, [x, y, displayX, displayY, color, transform])

  return {
    x,
    y,
    point,
    element,
  }
}

function getInverseTransform(transform: vec.Matrix) {
  const inverseTransform = new Array(9) as vec.Matrix
  invert(inverseTransform, transform)
  return inverseTransform
}

export default useMovablePoint
