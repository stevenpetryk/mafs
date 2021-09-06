import React, { useState } from "react"
import classnames from "classnames"
import * as vec from "vec-la"
import { useDrag } from "react-use-gesture"
import { useScaleContext } from "view/ScaleContext"

interface MovablePointProps {
  x: number
  y: number
  onMovement: (props: { movement: Vector2; first: boolean }) => void
  color?: string
}

const MovablePoint: React.VFC<MovablePointProps> = ({
  x,
  y,
  onMovement,
  color = "var(--mafs-blue)",
}) => {
  const { scaleX, scaleY, xSpan, ySpan, inversePixelMatrix } = useScaleContext()
  const [dragging, setDragging] = useState(false)

  const bind = useDrag(
    ({ event, down, movement, first }) => {
      event?.stopPropagation()
      setDragging(down)
      onMovement({ movement: vec.transform(movement, inversePixelMatrix), first })
    },
    { eventOptions: { passive: false } }
  )

  function handleKeyDown(event: React.KeyboardEvent) {
    const scale = event.altKey || event.metaKey || event.shiftKey ? 400 : 40

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        onMovement({ movement: [0, 0], first: true })
        onMovement({ movement: [-xSpan / scale, 0], first: false })
        break
      case "ArrowRight":
        onMovement({ movement: [0, 0], first: true })
        onMovement({ movement: [xSpan / scale, 0], first: false })
        event.preventDefault()
        break
      case "ArrowUp":
        onMovement({ movement: [0, 0], first: true })
        onMovement({ movement: [0, ySpan / scale], first: false })
        event.preventDefault()
        break
      case "ArrowDown":
        onMovement({ movement: [0, 0], first: true })
        onMovement({ movement: [0, -ySpan / scale], first: false })
        event.preventDefault()
        break
    }
  }

  return (
    <g {...bind()}>
      <circle cx={scaleX(x)} cy={scaleY(y)} r={30} fill="transparent"></circle>
      <circle
        cx={scaleX(x)}
        cy={scaleY(y)}
        r={6}
        fill={color}
        stroke={color}
        strokeOpacity={0.25}
        className={classnames("draggable", { dragging })}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      ></circle>
    </g>
  )
}

export default MovablePoint
