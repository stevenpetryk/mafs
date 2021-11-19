import React, { useContext, useEffect } from "react"
import invariant from "tiny-invariant"
import { Vector2 } from ".."
import { useMove } from "@use-gesture/react"
import { useMapContext } from "./MapContext"

const MousePositionContext = React.createContext<Vector2 | null>(null)

export function MousePositionProvider({ children }: { children: React.ReactNode }) {
  const { mapX, mapY } = useMapContext()
  const xOffset = mapX(0)
  const yOffset = mapY(0)

  const [mousePosition, setMousePosition] = React.useState<Vector2 | null>(null)

  const divRef = React.useRef<HTMLDivElement>(null)

  // Use useMove to get mouse position
  const bind = useMove(({ xy: [x, y] }) => {
    if (!divRef.current) return

    const base = divRef.current.getBoundingClientRect()

    console.log({ x: x - base.x - xOffset, y: -(y - base.y - yOffset) })
  })

  return (
    <MousePositionContext.Provider value={mousePosition}>
      <div ref={divRef} {...bind()} style={{ display: "contents" }}>
        {children}
      </div>
    </MousePositionContext.Provider>
  )
}

export function useMousePosition(): Vector2 {
  const mousePosition = useContext(MousePositionContext)

  invariant(
    mousePosition,
    "MousePositionContext is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  )

  return mousePosition
}

MousePositionContext.displayName = "MousePositionContext"

export default MousePositionContext
