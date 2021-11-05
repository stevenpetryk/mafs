import React, { useMemo, useState } from "react"
import * as vec from "vec-la"
import { theme } from "../display/Theme"
import { Vector2 } from "../math"
import MovablePoint from "./MovablePoint"

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
  initialPoint: Vector2,
  { constrain, color = theme.pink, transform = identity }: UseMovablePointArguments = {}
): UseMovablePoint {
  const [initialX, initialY] = initialPoint
  const [point, setPoint] = useState<Vector2>(initialPoint)
  const [x, y] = point

  const constraintFunction: ConstraintFunction = React.useMemo(() => {
    if (constrain === "horizontal") {
      return ([x]) => [x, initialY]
    } else if (constrain === "vertical") {
      return ([, y]) => [initialX, y]
    } else if (typeof constrain === "function") {
      return constrain
    }

    return ([x, y]) => [x, y]
  }, [constrain, initialX, initialY])

  const element = useMemo(() => {
    return (
      <MovablePoint
        {...{ point, transform, color }}
        constrain={constraintFunction}
        point={point}
        onMove={setPoint}
      />
    )
  }, [point, transform, color, constraintFunction])

  return {
    x,
    y,
    point: [x, y],
    element,
  }
}

export default useMovablePoint
