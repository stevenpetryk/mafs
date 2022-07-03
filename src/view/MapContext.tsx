import * as React from "react"
import invariant from "tiny-invariant"

export interface MapContextShape {
  mapX: (x: number) => number
  mapY: (y: number) => number
}

const MapContext = React.createContext<MapContextShape | null>(null)

export function useMapContext(): MapContextShape {
  const context = React.useContext(MapContext)
  invariant(
    context,
    "MapContext is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  )

  return context
}

export default MapContext
