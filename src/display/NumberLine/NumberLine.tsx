import * as React from "react"
import { Theme } from "../Theme"

/** A point on the number line */
export interface NumberLinePoint {
  /** Numeric value on the line */
  value: number
  /** Optional text label */
  label?: string
  /** Point color (default: Theme.blue) */
  color?: string
  /** Whether the point can be dragged (default: false) */
  draggable?: boolean
  /** Called when a draggable point's value changes */
  onChange?: (value: number) => void
}

/** An interval on the number line */
export interface NumberLineInterval {
  /** Start value */
  start: number
  /** End value */
  end: number
  /** Interval color (default: Theme.blue) */
  color?: string
  /** Fill opacity (default: 0.2) */
  opacity?: number
  /** Optional label for the interval */
  label?: string
  /** Whether the start point is inclusive (default: true) */
  startInclusive?: boolean
  /** Whether the end point is inclusive (default: true) */
  endInclusive?: boolean
}

/** Tick configuration */
export interface NumberLineTicks {
  /** Step between ticks */
  step: number
  /** Whether to show numeric labels (default: true) */
  labels?: boolean
}

/** Props for the NumberLine component */
export interface NumberLineProps {
  /** Range of the number line [min, max] */
  range: [number, number]
  /** Points to display */
  points?: NumberLinePoint[]
  /** Intervals to display */
  intervals?: NumberLineInterval[]
  /** Tick mark configuration */
  ticks?: NumberLineTicks
  /** Height in pixels (default: 60) */
  height?: number
  /** Width in pixels or "auto" (default: "auto") */
  width?: number | "auto"
}

/**
 * A standalone 1D number line visualization.
 * Supports points (static or draggable), intervals with open/closed endpoints,
 * and customizable tick marks.
 *
 * Renders its own SVG container and uses the Mafs theme system.
 */
export function NumberLine({
  range,
  points = [],
  intervals = [],
  ticks,
  height = 60,
  width: widthProp = "auto",
}: NumberLineProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = React.useState(widthProp === "auto" ? 500 : widthProp)

  React.useEffect(() => {
    if (widthProp !== "auto" || !containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [widthProp])

  const svgWidth = widthProp === "auto" ? containerWidth : widthProp
  const padding = 30
  const lineY = height / 2
  const [rangeMin, rangeMax] = range
  const rangeSpan = rangeMax - rangeMin

  const toPixel = React.useCallback(
    (value: number) => padding + ((value - rangeMin) / rangeSpan) * (svgWidth - 2 * padding),
    [rangeMin, rangeSpan, svgWidth],
  )

  // Drag state
  const [dragIndex, setDragIndex] = React.useState<number | null>(null)

  const handlePointerDown = React.useCallback((index: number) => {
    setDragIndex(index)
  }, [])

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (dragIndex === null) return
      const point = points[dragIndex]
      if (!point?.draggable || !point.onChange) return

      const svgRect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - svgRect.left
      const value = rangeMin + ((x - padding) / (svgWidth - 2 * padding)) * rangeSpan
      const clamped = Math.min(rangeMax, Math.max(rangeMin, value))
      point.onChange(clamped)
    },
    [dragIndex, points, rangeMin, rangeMax, rangeSpan, svgWidth],
  )

  const handlePointerUp = React.useCallback(() => {
    setDragIndex(null)
  }, [])

  // Generate tick values
  const tickValues = React.useMemo(() => {
    if (!ticks) return []
    const values: number[] = []
    const start = Math.ceil(rangeMin / ticks.step) * ticks.step
    for (let v = start; v <= rangeMax; v += ticks.step) {
      values.push(parseFloat(v.toFixed(10)))
    }
    return values
  }, [ticks, rangeMin, rangeMax])

  return (
    <div
      ref={containerRef}
      className="MafsView mafs-numberline"
      style={{ width: widthProp === "auto" ? "100%" : widthProp, height }}
    >
      <svg
        width={svgWidth}
        height={height}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        {/* Main line */}
        <line
          x1={padding}
          y1={lineY}
          x2={svgWidth - padding}
          y2={lineY}
          stroke="var(--mafs-fg)"
          strokeWidth={2}
        />

        {/* Arrowheads */}
        <polygon
          points={`${padding - 6},${lineY} ${padding + 2},${lineY - 4} ${padding + 2},${lineY + 4}`}
          fill="var(--mafs-fg)"
        />
        <polygon
          points={`${svgWidth - padding + 6},${lineY} ${svgWidth - padding - 2},${lineY - 4} ${svgWidth - padding - 2},${lineY + 4}`}
          fill="var(--mafs-fg)"
        />

        {/* Tick marks */}
        {tickValues.map((v) => (
          <g key={v}>
            <line
              x1={toPixel(v)}
              y1={lineY - 6}
              x2={toPixel(v)}
              y2={lineY + 6}
              stroke="var(--mafs-fg)"
              strokeWidth={1}
            />
            {ticks?.labels !== false && (
              <text
                x={toPixel(v)}
                y={lineY + 20}
                textAnchor="middle"
                fontSize={11}
                fill="var(--mafs-fg)"
              >
                {v}
              </text>
            )}
          </g>
        ))}

        {/* Intervals */}
        {intervals.map((interval, i) => {
          const x1 = toPixel(interval.start)
          const x2 = toPixel(interval.end)
          const intervalColor = interval.color ?? Theme.blue
          return (
            <g key={`interval-${i}`}>
              {/* Shaded region */}
              <rect
                x={x1}
                y={lineY - 4}
                width={x2 - x1}
                height={8}
                fill={intervalColor}
                opacity={interval.opacity ?? 0.2}
              />

              {/* Start endpoint */}
              <circle
                cx={x1}
                cy={lineY}
                r={5}
                fill={interval.startInclusive !== false ? intervalColor : "var(--mafs-bg)"}
                stroke={intervalColor}
                strokeWidth={2}
              />

              {/* End endpoint */}
              <circle
                cx={x2}
                cy={lineY}
                r={5}
                fill={interval.endInclusive !== false ? intervalColor : "var(--mafs-bg)"}
                stroke={intervalColor}
                strokeWidth={2}
              />

              {/* Interval label */}
              {interval.label && (
                <text
                  x={(x1 + x2) / 2}
                  y={lineY - 12}
                  textAnchor="middle"
                  fontSize={11}
                  fill={intervalColor}
                >
                  {interval.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Points */}
        {points.map((point, i) => {
          const px = toPixel(point.value)
          const pointColor = point.color ?? Theme.blue
          return (
            <g
              key={`point-${i}`}
              className={point.draggable ? "mafs-movable-point" : ""}
              style={point.draggable ? ({ "--movable-point-color": pointColor, cursor: "grab" } as React.CSSProperties) : undefined}
              onPointerDown={point.draggable ? () => handlePointerDown(i) : undefined}
              tabIndex={point.draggable ? 0 : undefined}
              role={point.draggable ? "slider" : undefined}
              aria-label={point.label ?? `Point at ${point.value}`}
              aria-valuemin={rangeMin}
              aria-valuemax={rangeMax}
              aria-valuenow={point.value}
            >
              {point.draggable && (
                <circle cx={px} cy={lineY} r={15} fill="transparent" />
              )}
              <circle cx={px} cy={lineY} r={6} fill={pointColor} />
              {point.label && (
                <text
                  x={px}
                  y={lineY - 12}
                  textAnchor="middle"
                  fontSize={12}
                  fill={pointColor}
                  fontWeight="bold"
                >
                  {point.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

NumberLine.displayName = "NumberLine"
