import * as React from "react"
import { Theme } from "./Theme"
import { sampleInequality } from "./Plot/PlotUtils"
import { usePaneContext } from "../context/PaneContext"
import { vec } from "../vec"

/** Fill pattern for the region */
export type RegionPattern = "solid" | "hatched" | "dotted"

/** Props for the Region component */
export interface RegionProps {
  /** Bounds defining the region. y can be a constant range, a single function (shaded to x-axis), or a tuple of [lower, upper] functions. */
  bounds: {
    x: vec.Vector2
    y: vec.Vector2 | ((x: number) => number) | [((x: number) => number), ((x: number) => number)]
  }
  /** Fill color (default: Theme.foreground) */
  color?: string
  /** Fill opacity (default: 0.15) */
  opacity?: number
  /** Optional label centered in the region */
  label?: string
  /** Fill pattern (default: "solid") */
  pattern?: RegionPattern
}

const patternIdCounter = { current: 0 }

/**
 * Renders a highlighted area between constants or functions.
 * Supports solid, hatched, and dotted fill patterns.
 *
 * A simpler API over Plot.Inequality for common shading use cases.
 */
export function Region({
  bounds,
  color = Theme.foreground,
  opacity = 0.15,
  label,
  pattern = "solid",
}: RegionProps) {
  const {
    xPaneRange: [xPaneMin, xPaneMax],
    yPaneRange: [yPaneMin, yPaneMax],
  } = usePaneContext()

  const patternId = React.useMemo(() => `mafs-region-pattern-${patternIdCounter.current++}`, [])

  const [xMin, xMax] = bounds.x
  const clampedXMin = Math.max(xMin, xPaneMin)
  const clampedXMax = Math.min(xMax, xPaneMax)

  let upperFn: (x: number) => number
  let lowerFn: (x: number) => number

  if (typeof bounds.y === "function") {
    upperFn = bounds.y
    lowerFn = () => 0
  } else if (Array.isArray(bounds.y) && typeof bounds.y[0] === "function") {
    const fns = bounds.y as [((x: number) => number), ((x: number) => number)]
    lowerFn = fns[0]
    upperFn = fns[1]
  } else {
    const [yLow, yHigh] = bounds.y as vec.Vector2
    lowerFn = () => yLow
    upperFn = () => yHigh
  }

  const svgPath = sampleInequality(
    "x",
    upperFn,
    lowerFn,
    [clampedXMin, clampedXMax],
    10,
    14,
    0.1,
  )

  const labelX = (clampedXMin + clampedXMax) / 2
  const labelY = (upperFn(labelX) + lowerFn(labelX)) / 2

  return (
    <g className="mafs-region">
      {/* Pattern definitions */}
      {pattern !== "solid" && (
        <defs>
          {pattern === "hatched" && (
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="8" stroke={color} strokeWidth="1.5" opacity={opacity * 3} />
            </pattern>
          )}
          {pattern === "dotted" && (
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
            >
              <circle cx="4" cy="4" r="1.5" fill={color} opacity={opacity * 3} />
            </pattern>
          )}
        </defs>
      )}

      {/* Fill */}
      <path
        d={svgPath.fill}
        style={{
          fill: pattern === "solid" ? color : `url(#${patternId})`,
          fillOpacity: pattern === "solid" ? opacity : 1,
          stroke: "none",
          transform: "var(--mafs-view-transform)",
          vectorEffect: "non-scaling-stroke",
        }}
      />

      {/* Label */}
      {label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fill={color}
          className="mafs-shadow"
          style={{
            transform: "var(--mafs-view-transform)",
            pointerEvents: "none",
          }}
        >
          {label}
        </text>
      )}
    </g>
  )
}

Region.displayName = "Region"
