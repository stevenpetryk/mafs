import * as React from "react"
import { useCoordinateContext } from "./CoordinateContext"
import { range, Interval } from "../math"

interface PaneContextShape {
  xPanes: Interval[]
  yPanes: Interval[]
  xPaneRange: Interval
  yPaneRange: Interval
}

const PaneContext = React.createContext<PaneContextShape>({
  xPanes: [],
  yPanes: [],
  xPaneRange: [0, 0],
  yPaneRange: [0, 0],
})
PaneContext.displayName = "PaneContext"

export function usePaneContext(): PaneContextShape {
  return React.useContext(PaneContext)
}

const PaneManager: React.FC = ({ children }) => {
  const { xMin, xMax, yMin, yMax } = useCoordinateContext()

  const base = 2

  const xSpan = xMax - xMin
  const xStep = base ** Math.round(Math.log10(xSpan) / Math.log10(base))
  const xLowerBound = Math.floor(xMin / xStep) * xStep
  const xUpperBound = Math.ceil(xMax / xStep) * xStep

  const ySpan = yMax - yMin
  const yStep = base ** Math.round(Math.log10(ySpan) / Math.log10(base))
  const yLowerBound = Math.floor(yMin / yStep) * yStep
  const yUpperBound = Math.ceil(yMax / yStep) * yStep

  const xPanes = React.useMemo(
    () => range(xLowerBound, xUpperBound, xStep).map((xMin) => [xMin, xMin + xStep] as Interval),
    [xLowerBound, xUpperBound, xStep]
  )

  const yPanes = React.useMemo(
    () => range(yLowerBound, yUpperBound, yStep).map((yMin) => [yMin, yMin + yStep] as Interval),
    [yLowerBound, yUpperBound, yStep]
  )

  const context = React.useMemo(
    () => ({
      xPanes,
      yPanes,
      xPaneRange: [xLowerBound, xUpperBound] as Interval,
      yPaneRange: [yLowerBound, yUpperBound] as Interval,
    }),
    [xPanes, yPanes, xLowerBound, xUpperBound, yLowerBound, yUpperBound]
  )

  return <PaneContext.Provider value={context}>{children}</PaneContext.Provider>
}

export default PaneManager
