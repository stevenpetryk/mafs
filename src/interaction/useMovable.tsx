import * as React from "react"
import { useDrag } from "@use-gesture/react"
import invariant from "tiny-invariant"
import { vec } from "../vec"
import { useSpanContext } from "../context/SpanContext"
import { useTransformContext } from "../context/TransformContext"
import { range } from "../math"

export interface UseMovableArguments {
  gestureTarget: React.RefObject<Element>
  onMove: (point: vec.Vector2) => unknown
  point: vec.Vector2
  constrain: (point: vec.Vector2) => vec.Vector2
}

export interface UseMovable {
  dragging: boolean
}

export function useMovable(args: UseMovableArguments): UseMovable {
  const { gestureTarget: target, onMove, point, constrain } = args
  const [dragging, setDragging] = React.useState(false)
  const { xSpan, ySpan } = useSpanContext()
  const { viewTransform, userTransform } = useTransformContext()

  const inverseViewTransform = vec.matrixInvert(viewTransform)
  invariant(inverseViewTransform, "The view transform must be invertible.")

  const inverseTransform = React.useMemo(() => getInverseTransform(userTransform), [userTransform])

  const pickup = React.useRef<vec.Vector2>([0, 0])

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
              inverseTransform,
            ),
          )

          if (vec.dist(testPoint, point) > min) {
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
        onMove(constrain(vec.transform(vec.add(pickup.current, movement), inverseTransform)))
      }
    },
    { target, eventOptions: { passive: false } },
  )
  return { dragging }
}

function getInverseTransform(transform: vec.Matrix) {
  const invert = vec.matrixInvert(transform)
  invariant(
    invert !== null,
    "Could not invert transform matrix. A parent transformation matrix might be degenerative (mapping 2D space to a line).",
  )
  return invert
}
