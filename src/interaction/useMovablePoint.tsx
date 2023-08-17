import * as React from "react"
import { Theme } from "../display/Theme"
import { MovablePoint } from "./MovablePoint"
import type { Vector2 } from "../algebra/types"

export type ConstraintFunction = (position: Vector2) => Vector2

export interface UseMovablePointArguments {
  color?: string

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
  setPoint: (point: Vector2) => void
}

export function useMovablePoint(
  initialPoint: Vector2,
  { constrain, color = Theme.pink }: UseMovablePointArguments = {},
): UseMovablePoint {
  const [initialX, initialY] = initialPoint
  const [point, setPoint] = React.useState<Vector2>(initialPoint)
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

  const element = React.useMemo(() => {
    return <MovablePoint {...{ point, color }} constrain={constraintFunction} onMove={setPoint} />
  }, [point, color, constraintFunction])

  return {
    x,
    y,
    point: [x, y],
    element,
    setPoint,
  }
}
