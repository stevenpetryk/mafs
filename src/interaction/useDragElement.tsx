import { useDrag } from "@use-gesture/react"
import * as React from "react"
import invariant from "tiny-invariant"
import { range } from "../math"
import { vec } from "../vec"
import { useTransformContext } from "../context/TransformContext"
import { useSpanContext } from "../context/SpanContext"
import useControlled from "./useControlled"

function getInverseTransform(transform: vec.Matrix) {
  const invert = vec.matrixInvert(transform)
  invariant(
    invert !== null,
    "Could not invert transform matrix. Your movable point's transformation matrix might be degenerative (mapping 2D space to a line)."
  )
  return invert
}

export type ConstraintFunction = (position: vec.Vector2) => vec.Vector2

type UseDragElementParams = {
  /** The initial position.
   * @default origine
   */
  initialPoint?: vec.Vector2
  /** The current position `[x, y]` of the point.
   * Can be undefined if you do not whant to control it.
   */
  point?: vec.Vector2
  /** A callback that is called as the user moves the point. */
  onMove: (point: vec.Vector2) => void
  /**
   * Constrain the point to only horizontal movement, vertical movement, or mapped movement.
   *
   * In mapped movement mode, you must provide a function that maps the user's mouse position
   * `[x, y]` to the position the point should "snap" to.
   */
  constrain?: ConstraintFunction
}
export function useDragElement({
  initialPoint = [0, 0],
  point: inPoint,
  onMove,
  constrain = (point) => point,
}: UseDragElementParams) {
  const [point, setPoint] = useControlled({
    controlled: inPoint,
    default: initialPoint,
    name: "point",
  })
  const { viewTransform, userTransform } = useTransformContext()
  const { xSpan, ySpan } = useSpanContext()
  const inverseViewTransform = vec.matrixInvert(viewTransform)
  invariant(inverseViewTransform, "The view transform must be invertible.")

  const inverseTransform = React.useMemo(() => getInverseTransform(userTransform), [userTransform])

  const combinedTransform = React.useMemo(
    () => vec.matrixMult(viewTransform, userTransform),
    [viewTransform, userTransform]
  )

  const [dragging, setDragging] = React.useState(false)
  const [displayX, displayY] = vec.transform(point, combinedTransform)

  const pickup = React.useRef<vec.Vector2>([0, 0])

  const ref = React.useRef<SVGGElement>(null)

  useDrag(
    (state) => {
      const { type, event } = state
      event?.stopPropagation()

      const isKeyboard = type.includes("key")
      if (isKeyboard) {
        event?.preventDefault()
        const { direction: yDownDirection, altKey, metaKey, shiftKey } = state

        const direction = [yDownDirection[0], -yDownDirection[1]] as vec.Vector2
        const span = Math.abs(direction[0]) ? xSpan : ySpan

        let divisions = 50
        if (altKey || metaKey) divisions = 200
        if (shiftKey) divisions = 10

        const min = span / (divisions * 2)
        const tests = range(span / divisions, span / 2, span / divisions)

        for (const dx of tests) {
          // Transform the test back into the point's coordinate system
          const testMovement = vec.scale(direction, dx)
          const testPoint = constrain(
            vec.transform(
              vec.add(vec.transform(point, userTransform), testMovement),
              inverseTransform
            )
          )

          if (vec.dist(testPoint, point) > min) {
            setPoint(testPoint)
            onMove(testPoint)
            break
          }
        }
      } else {
        const { last, movement: pixelMovement, first } = state

        setDragging(!last)

        if (first) pickup.current = vec.transform(point, userTransform)
        if (vec.mag(pixelMovement) === 0) return

        const movement = vec.transform(pixelMovement, inverseViewTransform)
        const newPoint = constrain(
          vec.transform(vec.add(pickup.current, movement), inverseTransform)
        )
        setPoint(newPoint)
        onMove(newPoint)
      }
    },
    { target: ref, eventOptions: { passive: false } }
  )

  return { ref, dragging, displayX, displayY }
}
