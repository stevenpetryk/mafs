import { useDrag } from "@use-gesture/react"
import * as React from "react"
import invariant from "tiny-invariant"
import { Theme } from "../display/Theme"
import { range } from "../math"
import * as vec from "../vec"
import { useScaleContext } from "../view/ScaleContext"

export type ConstraintFunction = (position: vec.Vector2) => vec.Vector2

export interface MovablePointProps {
  /** The current position (`[x, y]`) of the point. */
  point: vec.Vector2
  /** A callback that is called as the user moves the point. */
  onMove: (point: vec.Vector2) => void
  /**
   * Transform the point's movement and constraints by a transformation matrix. You can use the
   * `vec` export to build up such a matrix.
   */
  transform?: vec.Matrix
  /**
   * Constrain the point to only horizontal movement, vertical movement, or mapped movement.
   *
   * In mapped movement mode, you must provide a function that maps the user's attempted position
   * (x, y) to the position the point should "snap" to.
   */
  constrain?: ConstraintFunction
  color?: string
}

const identity = vec.matrixBuilder().get()

export const MovablePoint: React.VFC<MovablePointProps> = ({
  point,
  onMove,
  constrain = (point) => point,
  color = Theme.pink,
  transform = identity,
}) => {
  const { xSpan, ySpan, pixelMatrix, inversePixelMatrix } = useScaleContext()
  const inverseTransform = React.useMemo(() => getInverseTransform(transform), [transform])

  const [dragging, setDragging] = React.useState(false)
  const [displayX, displayY] = vec.transform(vec.transform(point, transform), pixelMatrix)

  const pickup = React.useRef<vec.Vector2>([0, 0])

  const bind = useDrag(({ event, down, movement: pixelMovement, first }) => {
    event?.stopPropagation()
    setDragging(down)

    if (first) pickup.current = vec.transform(point, transform)
    if (vec.mag(pixelMovement) === 0) return

    const movement = vec.transform(pixelMovement, inversePixelMatrix)
    const newPoint = constrain(vec.transform(vec.add(pickup.current, movement), inverseTransform))

    onMove(newPoint)
  })

  function handleKeyDown(event: React.KeyboardEvent) {
    const small = event.altKey || event.metaKey || event.shiftKey

    let span: number
    let testDir: vec.Vector2

    switch (event.key) {
      case "ArrowLeft":
        span = xSpan
        testDir = [-1, 0]
        event.preventDefault()
        break
      case "ArrowRight":
        span = xSpan
        testDir = [1, 0]
        event.preventDefault()
        break
      case "ArrowUp":
        span = ySpan
        testDir = [0, 1]
        event.preventDefault()
        break
      case "ArrowDown":
        span = ySpan
        testDir = [0, -1]
        event.preventDefault()
        break
      default:
        return
    }

    const divisions = small ? 200 : 50
    const min = span / (divisions * 2)
    const tests = range(span / divisions, span / 2, span / divisions)

    for (const dx of tests) {
      // Transform the test back into the point's coordinate system
      const testMovement = vec.scale(testDir, dx)
      const testPoint = constrain(
        vec.transform(vec.add(vec.transform(point, transform), testMovement), inverseTransform)
      )

      if (vec.dist(testPoint, point) > min) {
        onMove(testPoint)
        break
      }
    }
  }

  return (
    <g {...bind()} className="draggable-hitbox">
      <circle cx={displayX} cy={displayY} r={30} fill="transparent"></circle>
      <circle
        cx={displayX}
        cy={displayY}
        r={6}
        fill={color}
        stroke={color}
        strokeOpacity={0.25}
        className={`draggable ${dragging ? "dragging" : ""}`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      ></circle>
    </g>
  )
}

function getInverseTransform(transform: vec.Matrix) {
  const invert = vec.matrixInvert(transform)
  invariant(
    invert !== null,
    "Could not invert transform matrix. Your movable point's transformation matrix might be degenerative (mapping 2D space to a line)."
  )
  return invert
}
