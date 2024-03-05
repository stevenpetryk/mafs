import { useDrag } from "@use-gesture/react"
import * as React from "react"
import invariant from "tiny-invariant"
import { Theme } from "../display/Theme"
import { range } from "../math"
import { vec } from "../vec"
import { useTransformContext } from "../context/TransformContext"
import { useSpanContext } from "../context/SpanContext"

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

export function useMovementInteraction({
  target,
  onMove,
  point,
  constrain,
}: {
  target: React.RefObject<Element>
  onMove: (point: vec.Vector2) => unknown
  point: vec.Vector2
  constrain: (point: vec.Vector2) => vec.Vector2
}): { dragging: boolean } {
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

export interface MovablePointSVGProps {
  color: string
  ringRadiusPx: number
  dragging: boolean
  point: vec.Vector2
}

export const MovablePointSVG = React.forwardRef<SVGGElement, MovablePointSVGProps>(
  (props: MovablePointSVGProps, ref) => {
    const { color, ringRadiusPx, dragging, point } = props

    const { viewTransform, userTransform } = useTransformContext()

    const combinedTransform = React.useMemo(
      () => vec.matrixMult(viewTransform, userTransform),
      [viewTransform, userTransform],
    )

    const [xPx, yPx] = vec.transform(point, combinedTransform)

    return (
      <g
        ref={ref}
        style={
          {
            "--movable-point-color": color,
            "--movable-point-ring-size": `${ringRadiusPx}px`,
          } as React.CSSProperties
        }
        className={`mafs-movable-point ${dragging ? "mafs-movable-point-dragging" : ""}`}
        tabIndex={0}
      >
        <circle className="mafs-movable-point-hitbox" r={30} cx={xPx} cy={yPx}></circle>
        <circle
          className="mafs-movable-point-focus"
          r={ringRadiusPx + 1}
          cx={xPx}
          cy={yPx}
        ></circle>
        <circle className="mafs-movable-point-ring" r={ringRadiusPx} cx={xPx} cy={yPx}></circle>
        <circle className="mafs-movable-point-point" r={6} cx={xPx} cy={yPx}></circle>
      </g>
    )
  },
)

MovablePointSVG.displayName = "MovablePointSVG"

export function MovablePoint({
  point,
  onMove,
  constrain = (point) => point,
  color = Theme.pink,
}: MovablePointProps) {
  const ref = React.useRef<SVGGElement>(null)

  const { dragging } = useMovementInteraction({ target: ref, onMove, point, constrain })

  return (
    <MovablePointSVG ref={ref} point={point} color={color} ringRadiusPx={15} dragging={dragging} />
  )
}

MovablePoint.displayName = "MovablePoint"

function getInverseTransform(transform: vec.Matrix) {
  const invert = vec.matrixInvert(transform)
  invariant(
    invert !== null,
    "Could not invert transform matrix. Your movable point's transformation matrix might be degenerative (mapping 2D space to a line).",
  )
  return invert
}
