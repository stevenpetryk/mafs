import * as React from "react"
import invariant from "tiny-invariant"
import { vec } from "../vec"

interface TransformContextShape {
  /**
   * The resulting transformation matrix from any user-provided transforms (via
   * the `<Transform />` component).
   */
  userTransform: vec.Matrix

  /**
   * A transformation that maps "math" space to pixel space. Note that, in many
   * cases, you don't need to use this transformation directly. Instead, use the
   * `var(--mafs-view-transform)` CSS custom property in combination with the
   * SVG `transform` prop.
   */
  viewTransform: vec.Matrix
}

export const TransformContext = React.createContext<TransformContextShape | null>(null)
TransformContext.displayName = "TransformContext"

/**
 * A hook that returns the current transformation context. This is useful for
 * building custom Mafs components that need to be aware of how to map between
 * world space and pixel space, and also need to respond to user-provided
 * transformations.
 */
export function useTransformContext() {
  const context = React.useContext(TransformContext)

  invariant(
    context,
    "TransformContext is not loaded. Are you rendering a Mafs component outside of a MafsView?",
  )

  return context
}
