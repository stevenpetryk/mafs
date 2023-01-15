import * as React from "react"
import invariant from "tiny-invariant"

import type { Matrix } from "../vec"

export interface ViewportTransformContextShape {
  toPx: Matrix
  fromPx: Matrix
  toPxCSS: string
  fromPxCSS: string
}

const ScaleContext = React.createContext<ViewportTransformContextShape | null>(null)

export function useViewportTransformContext(): ViewportTransformContextShape {
  const context = React.useContext(ScaleContext)
  invariant(
    context,
    "ViewportTransformContext is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  )

  return context
}

export default ScaleContext
