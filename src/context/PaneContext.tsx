import * as React from "react"
import { useCoordinateContext } from "./CoordinateContext"
import { range, Interval } from "../math"
const { round, ceil, floor, log2 } = Math

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

function PaneManager({ children }: { children: React.ReactNode }) {
  const { xMin, xMax, yMin, yMax } = useCoordinateContext()

  const xPaneSize = 2 ** round(log2(xMax - xMin) - 1)
  const yPaneSize = 2 ** round(log2(yMax - yMin) - 1)

  // When there's only `pad` remaining of the current pane, we round up to
  // load the next pane. For example, if each pane is 2 units wide, the next
  // step of panes will be loaded at x = 1.75, 3.75, 5.75, etc when pad = 1/8.
  const pad = 1 / 8
  const xLowerBound = xPaneSize * floor(xMin / xPaneSize - pad)
  const xUpperBound = xPaneSize * ceil(xMax / xPaneSize + pad)
  const yLowerBound = yPaneSize * floor(yMin / yPaneSize - pad)
  const yUpperBound = yPaneSize * ceil(yMax / yPaneSize + pad)

  const xPanes = React.useMemo(
    () =>
      range(xLowerBound, xUpperBound - xPaneSize, xPaneSize).map(
        (xMin) => [xMin, xMin + xPaneSize] as Interval,
      ),
    [xLowerBound, xUpperBound, xPaneSize],
  )

  const yPanes = React.useMemo(
    () =>
      range(yLowerBound, yUpperBound - yPaneSize, yPaneSize).map(
        (yMin) => [yMin, yMin + yPaneSize] as Interval,
      ),
    [yLowerBound, yUpperBound, yPaneSize],
  )

  const context = React.useMemo(
    () => ({
      xPanes,
      yPanes,
      xPaneRange: [xLowerBound, xUpperBound] as Interval,
      yPaneRange: [yLowerBound, yUpperBound] as Interval,
    }),
    [xPanes, yPanes, xLowerBound, xUpperBound, yLowerBound, yUpperBound],
  )

  return <PaneContext.Provider value={context}>{children}</PaneContext.Provider>
}

PaneManager.displayName = "PaneManager"

export default PaneManager
