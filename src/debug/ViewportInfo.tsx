import { useCoordinateContext } from "../context/CoordinateContext"
import { usePaneContext } from "../context/PaneContext"
import { useTransformContext } from "../context/TransformContext"
import { vec } from ".."

interface PaneVisualizerProps {
  /** The number of decimal places to which to round the displayed values. */
  precision?: number
}

export function ViewportInfo({ precision = 3 }: PaneVisualizerProps) {
  const { xMin, xMax, yMin, yMax } = useCoordinateContext()
  const { viewTransform } = useTransformContext()
  const { xPanes, yPanes } = usePaneContext()

  const [x, y] = vec.transform([xMin, yMin], viewTransform)

  const xPanesString = xPanes.map((pane) => `(${pane.join(", ")})`).join("   ")
  const yPanesString = yPanes.map((pane) => `(${pane.join(", ")})`).join("   ")

  return (
    <g className="mafs-shadow" fontFamily="monospace">
      <text x={x + 10} y={y - 70}>
        x: ({xMin.toFixed(precision)}, {xMax.toFixed(precision)})
      </text>
      <text x={x + 10} y={y - 50}>
        y: ({yMin.toFixed(precision)}, {yMax.toFixed(precision)})
      </text>
      <text x={x + 10} y={y - 30}>
        xPanes: {xPanesString}
      </text>
      <text x={x + 10} y={y - 10}>
        yPanes: {yPanesString}
      </text>
    </g>
  )
}

ViewportInfo.displayName = "Debug.ViewportInfo"
