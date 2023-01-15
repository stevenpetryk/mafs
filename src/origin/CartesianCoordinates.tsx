import * as React from "react"
import { range, round } from "../math"
import { usePaneContext } from "../context/PaneManager"
import { useViewTransform } from "../context/ViewTransformContext"
import * as vec from "../vec"

export type LabelMaker = (value: number) => number | string

// This is sort of a hack—every SVG pattern on a page needs a unique ID, otherwise they conflict.
let incrementer = 0

export type AxisOptions = {
  axis: boolean
  lines: number | false
  subdivisions: number | false
  labels: false | LabelMaker
}

const defaultAxisOptions: Partial<AxisOptions> = {
  axis: true,
  lines: 1,
  labels: (x) => x,
}

export interface CartesianCoordinatesProps {
  xAxis?: Partial<AxisOptions> | false
  yAxis?: Partial<AxisOptions> | false
  subdivisions?: number | false
}

export function CartesianCoordinates({
  xAxis: xAxisOverrides,
  yAxis: yAxisOverrides,
  subdivisions = false,
}: CartesianCoordinatesProps) {
  const xAxis = { subdivisions, ...defaultAxisOptions, ...xAxisOverrides } as AxisOptions
  const yAxis = { subdivisions, ...defaultAxisOptions, ...yAxisOverrides } as AxisOptions

  const id = React.useMemo(() => `mafs-grid-${incrementer++}`, [])

  const { xPaneRange, yPaneRange } = usePaneContext()
  const [minX, maxX] = xPaneRange
  const [minY, maxY] = yPaneRange

  return (
    <g>
      <g style={{ transform: "var(--mafs-transform-to-px)" }}>
        <defs>
          <GridPattern
            id={id}
            xLines={xAxisOverrides != false ? xAxis.lines : false}
            yLines={yAxisOverrides != false ? yAxis.lines : false}
            xSubdivisions={xAxisOverrides != false ? xAxis.subdivisions : false}
            ySubdivisions={yAxisOverrides != false ? yAxis.subdivisions : false}
          />
        </defs>

        <rect fill={`url(#${id})`} x={minX} y={minY} width={maxX - minX} height={maxY - minY} />

        {xAxisOverrides !== false && xAxis.axis && (
          <line
            x1={minX}
            x2={maxX}
            y1={0}
            y2={0}
            style={{ stroke: "var(--mafs-origin-color)", transform: "var(--mafs-transform-to-px)" }}
            vectorEffect="non-scaling-stroke"
          />
        )}

        {yAxisOverrides !== false && yAxis.axis && (
          <line
            x1={0}
            x2={0}
            y1={minY}
            y2={maxY}
            style={{ stroke: "var(--mafs-origin-color)", transform: "var(--mafs-transform-to-px)" }}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </g>

      {xAxisOverrides !== false && xAxis.labels && (
        <XLabels labelMaker={xAxis.labels} separation={xAxis.lines || 1} />
      )}
      {yAxisOverrides !== false && yAxis.labels && (
        <YLabels labelMaker={yAxis.labels} separation={yAxis.lines || 1} />
      )}
    </g>
  )
}

export interface LabelsProps {
  separation: number
  labelMaker: LabelMaker
}
const XLabels: React.VFC<LabelsProps> = ({ separation, labelMaker }) => {
  const { toPx } = useViewTransform()
  const { xPanes } = usePaneContext()
  const xs = snappedRange(
    xPanes[0][0] - separation,
    xPanes[xPanes.length - 1][1] + separation,
    separation
  ).filter((x) => x !== 0)

  return (
    <g className="mafs-shadow">
      {xs.map((x) => (
        <text
          key={x}
          x={vec.transform([x, 0], toPx)[0]}
          y={5}
          dominantBaseline="hanging"
          textAnchor="middle"
        >
          {labelMaker(x)}
        </text>
      ))}
    </g>
  )
}
const YLabels: React.VFC<LabelsProps> = ({ separation, labelMaker }) => {
  const { toPx } = useViewTransform()
  const { yPanes } = usePaneContext()
  const ys = snappedRange(
    yPanes[0][0] - separation,
    yPanes[yPanes.length - 1][1] + separation,
    separation
  ).filter((y) => y !== 0)

  return (
    <g className="mafs-shadow">
      {ys.map((y) => (
        <text key={y} x={5} y={vec.transform([0, y], toPx)[1]} dominantBaseline="central">
          {labelMaker(y)}
        </text>
      ))}
    </g>
  )
}

function snappedRange(min: number, max: number, step: number) {
  return range(Math.floor(min / step) * step, Math.ceil(max / step) * step, step)
}

export function autoPi(x: number): string {
  if (x === 0) return "0"
  if (Math.abs(Math.PI - x) < 0.001) return "π"
  if (Math.abs(-Math.PI - x) < 0.001) return "-π"
  return `${round(x / Math.PI, 5)}π`
}

interface GridPatternProps {
  id: string
  xLines: number | false
  yLines: number | false
  xSubdivisions: number | false
  ySubdivisions: number | false
}

/**
 * @private
 *
 * Creates an SVG <pattern> that looks like a cartesian coordinate plane grid.
 *
 * This is a bit more complex than just rendering lines, but is way more performant, since the
 * browser handles making the pattern repeat for us.
 */
const GridPattern: React.VFC<GridPatternProps> = ({
  id,
  xLines,
  yLines,
  xSubdivisions,
  ySubdivisions,
}) => {
  const width = xLines || 1
  const height = yLines || 1

  let xs: number[] = []
  if (xSubdivisions && xSubdivisions > 1) {
    const pixelXDistance = width / xSubdivisions
    xs = range(0, width + pixelXDistance * 1.1, pixelXDistance)
  }

  let ys: number[] = []
  if (ySubdivisions && ySubdivisions > 1) {
    const pixelYDistance = height / ySubdivisions
    ys = range(0, height + pixelYDistance * 1.1, pixelYDistance)
  }

  return (
    <pattern id={id} x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
      {xs.map((x) => (
        <line
          key={x}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          style={{
            vectorEffect: "non-scaling-stroke",
            stroke: "var(--grid-line-subdivision-color)",
          }}
        />
      ))}
      {ys.map((y) => (
        <line
          key={y}
          y1={y}
          x1={0}
          y2={y}
          x2={width}
          style={{
            vectorEffect: "non-scaling-stroke",
            stroke: "var(--grid-line-subdivision-color)",
          }}
        />
      ))}

      {xLines && (
        <>
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={height}
            style={{ vectorEffect: "non-scaling-stroke", stroke: "var(--mafs-line-color)" }}
          />
          <line
            x1={width}
            y1={0}
            x2={width}
            y2={height}
            style={{ vectorEffect: "non-scaling-stroke", stroke: "var(--mafs-line-color)" }}
          />
        </>
      )}

      {yLines && (
        <>
          <line
            x1={0}
            y1={0}
            x2={width}
            y2={0}
            style={{ vectorEffect: "non-scaling-stroke", stroke: "var(--mafs-line-color)" }}
          />
          <line
            x1={0}
            y1={height}
            x2={width}
            y2={height}
            style={{ vectorEffect: "non-scaling-stroke", stroke: "var(--mafs-line-color)" }}
          />
        </>
      )}
    </pattern>
  )
}
