import * as React from "react"
import invariant from "tiny-invariant"

export interface CoordinateContextShape {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  width: number
  height: number
}

const CoordinateContext = React.createContext<CoordinateContextShape | null>(null)

export function useCoordinateContext(): CoordinateContextShape {
  const context = React.useContext(CoordinateContext)
  invariant(
    context,
    "CoordinateContext is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  )

  return context
}

export default CoordinateContext
