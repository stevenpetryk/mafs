import * as React from "react"
import { Theme } from "../display/Theme"
import { vec } from "../vec"
import { useMovable } from "./useMovable"
import { MovablePointDisplay } from "../display/MovablePointDisplay"

export type ConstraintFunction = (position: vec.Vector2) => vec.Vector2

export interface MovablePointProps {
  /** The current position `[x, y]` of the point. */
  point: vec.Vector2
  /** A callback that is called as the user moves the point. */
  onMove: (point: vec.Vector2) => void
  /**
   * Constrain the point to only horizontal movement, vertical movement, or mapped movement.
   *
   * In mapped movement mode, you must provide a function that maps the user's mouse position
   * `[x, y]` to the position the point should "snap" to.
   */
  constrain?: ConstraintFunction
  color?: string
}

export function MovablePoint({
  point,
  onMove,
  constrain = (point) => point,
  color = Theme.pink,
}: MovablePointProps) {
  const ref = React.useRef<SVGGElement>(null)

  const { dragging } = useMovable({ gestureTarget: ref, onMove, point, constrain })

  return <MovablePointDisplay ref={ref} point={point} color={color} dragging={dragging} />
}

MovablePoint.displayName = "MovablePoint"
