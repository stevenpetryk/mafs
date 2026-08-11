import * as React from "react"
import { Theme } from "../display/Theme"
import { vec } from "../vec"
import { MovablePoint } from "./MovablePoint"

export type ConstraintFunction = (position: vec.Vector2) => vec.Vector2

export interface UseMovablePointArguments {
  color?: string
  /** Additional props passed to the rendered movable point. */
  onClick?: React.MouseEventHandler<SVGGElement>
  svgGroupProps?: React.SVGProps<SVGGElement>

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
  point: vec.Vector2
  element: React.ReactElement
  setPoint: (point: vec.Vector2) => void
}

export function useMovablePoint(
  initialPoint: vec.Vector2,
  { constrain, color = Theme.pink, onClick, svgGroupProps }: UseMovablePointArguments = {},
): UseMovablePoint {
  const [initialX, initialY] = initialPoint

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

  // Apply the constraint to the initial point so that the point never
  // starts in a position that violates the constraint (#99).
  const [point, setPointInternal] = React.useState<vec.Vector2>(() =>
    constraintFunction(initialPoint),
  )
  const [x, y] = point

  // The drag handler in `useMovable` already applies the constraint before
  // calling `onMove`, so the raw setter is passed here to avoid constraining
  // twice.
  const element = React.useMemo(() => {
    return (
      <MovablePoint
        {...{ point, color }}
        constrain={constraintFunction}
        onMove={setPointInternal}
        onClick={onClick}
        svgGroupProps={svgGroupProps}
      />
    )
  }, [point, color, constraintFunction, onClick, svgGroupProps])

  // Imperative updates should also respect the constraint (#99).
  const setPoint = React.useCallback(
    (point: vec.Vector2) => setPointInternal(constraintFunction(point)),
    [constraintFunction],
  )

  return {
    x,
    y,
    point: [x, y],
    element,
    setPoint,
  }
}
