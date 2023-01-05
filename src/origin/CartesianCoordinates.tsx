import * as React from "react"
import GridPattern from "./GridPattern"
import { range, round } from "../math"
import { usePaneContext } from "../view/PaneManager"
import { useScaleContext } from "../view/ScaleContext"

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
  const { scaleX, scaleY } = useScaleContext()
  const [minX, maxX] = xPaneRange.map(scaleX)
  const [minY, maxY] = yPaneRange.map(scaleY)

  return (
    <>
      <defs>
        <GridPattern
          id={id}
          xLines={xAxisOverrides != false ? xAxis.lines : false}
          yLines={yAxisOverrides != false ? yAxis.lines : false}
          xSubdivisions={xAxisOverrides != false ? xAxis.subdivisions : false}
          ySubdivisions={yAxisOverrides != false ? yAxis.subdivisions : false}
        />
      </defs>

      <rect fill={`url(#${id})`} x={minX} y={maxY} width={maxX - minX} height={-(maxY - minY)} />

      {xAxisOverrides !== false && xAxis.labels && (
        <XLabels labelMaker={xAxis.labels} separation={xAxis.lines || 1} />
      )}
      {yAxisOverrides !== false && yAxis.labels && (
        <YLabels labelMaker={yAxis.labels} separation={yAxis.lines || 1} />
      )}

      {xAxisOverrides !== false && xAxis.axis && (
        <line
          x1={-10000000}
          x2={10000000}
          y1={0}
          y2={0}
          style={{ stroke: "var(--mafs-origin-color)" }}
        />
      )}

      {yAxisOverrides !== false && yAxis.axis && (
        <line
          x1={0}
          x2={0}
          y1={-10000000}
          y2={10000000}
          style={{ stroke: "var(--mafs-origin-color)" }}
        />
      )}
    </>
  )
}

export interface LabelsProps {
  separation: number
  labelMaker: LabelMaker
}
const XLabels: React.VFC<LabelsProps> = ({ separation, labelMaker }) => {
  const { scaleX } = useScaleContext()
  const { xPanes } = usePaneContext()
  const xs = snappedRange(
    xPanes[0][0] - separation,
    xPanes[xPanes.length - 1][1] + separation,
    separation
  )

  return (
    <g className="mafs-shadow">
      {xs
        .filter((x) => Math.abs(scaleX(x) - scaleX(0)) > 1)
        .map((x) => (
          <text key={x} x={scaleX(x)} y={5} dominantBaseline="hanging" textAnchor="middle">
            {labelMaker(x)}
          </text>
        ))}
    </g>
  )
}
const YLabels: React.VFC<LabelsProps> = ({ separation, labelMaker }) => {
  const { scaleY } = useScaleContext()
  const { yPanes } = usePaneContext()
  const ys = snappedRange(
    yPanes[0][0] - separation,
    yPanes[yPanes.length - 1][1] + separation,
    separation
  )

  return (
    <g className="mafs-shadow">
      {ys
        .filter((y) => Math.abs(scaleY(y) - scaleY(0)) > 1)
        .map((y) => (
          <text key={y} x={5} y={scaleY(y)} dominantBaseline="central">
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
