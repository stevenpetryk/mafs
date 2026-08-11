import * as React from "react"
import invariant from "tiny-invariant"

export interface MafsContextShape {
  svgRef: React.RefObject<SVGSVGElement>
  latexLayer: HTMLDivElement | null
}

export const MafsContext = React.createContext<MafsContextShape | null>(null)
MafsContext.displayName = "MafsContext"

export function useMafsContext(): MafsContextShape {
  const context = React.useContext(MafsContext)

  invariant(
    context,
    "MafsContext is not loaded. Are you rendering a Mafs component outside of a MafsView?",
  )

  return context
}
