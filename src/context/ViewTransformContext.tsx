import * as React from "react"
import invariant from "tiny-invariant"

import type { Matrix } from "../vec"

export interface ViewTransformContextShape {
  toPx: Matrix
  fromPx: Matrix
}

const ViewTransformContext = React.createContext<ViewTransformContextShape | null>(null)
ViewTransformContext.displayName = "ViewTransformContext"

export function useViewTransform(): ViewTransformContextShape {
  const context = React.useContext(ViewTransformContext)
  invariant(
    context,
    "ViewTransformContext is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  )

  return context
}

export default ViewTransformContext
