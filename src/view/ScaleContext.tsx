import React, { useContext } from "react"
import invariant from "tiny-invariant"

import type { Matrix } from "vec-la"

export interface ScaleContextShape {
  scaleX: (x: number) => number
  scaleY: (y: number) => number
  xSpan: number
  ySpan: number
  pixelMatrix: Matrix
  inversePixelMatrix: Matrix
  cssScale: string
}

const ScaleContext = React.createContext<ScaleContextShape | null>(null)

export function useScaleContext(): ScaleContextShape {
  const context = useContext(ScaleContext)
  invariant(
    context,
    "ScaleContext is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  )

  return context
}

export default ScaleContext
