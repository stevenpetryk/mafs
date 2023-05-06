"use client"
import * as React from "react"
// prettier-ignore
import { Mafs, Coordinates, MovablePoint, useDragElement, Line, Theme, vec } from "mafs"

type CustomDragElementProps = {
  point: vec.Vector2
  onMove: (point: vec.Vector2) => void
}

const CustomDragElement = ({
  point,
  onMove,
}: CustomDragElementProps) => {
  const { ref, dragging, displayX, displayY } =
    useDragElement({
      point,
      onMove,
    })

  return (
    <g
      ref={ref}
      className={`mafs-movable-point ${
        dragging ? "mafs-movable-point-dragging" : ""
      }`}
      tabIndex={0}
    >
      <g
        style={{
          transform: `translate(${displayX}px, ${displayY}px)`,
        }}
      >
        <circle
          className="mafs-movable-point-hitbox"
          r={30}
          cx={0}
          cy={0}
          style={{
            stroke: "white",
            strokeWidth: 2,
          }}
        />
        <text
          textAnchor="middle"
          alignmentBaseline="middle"
          style={{
            pointerEvents: "none",
          }}
        >
          A
        </text>
      </g>
    </g>
  )
}
export default function CustomMovablePoints() {
  const [point, onMove] = React.useState<vec.Vector2>([
    1, 2,
  ])

  return (
    <Mafs>
      <Coordinates.Cartesian />

      <CustomDragElement point={point} onMove={onMove} />
    </Mafs>
  )
}
