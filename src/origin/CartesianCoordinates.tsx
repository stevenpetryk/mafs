import * as React from "react"
import { range, round } from "../math"
import { usePaneContext } from "../context/PaneContext"
import { useTransformContext } from "../context/TransformContext"
import * as vec from "../vec"
import GridPattern from "./GridPattern"

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

  const { viewTransform } = useTransformContext()
  const [minXPx, minYPx] = vec.transform([minX, maxY], viewTransform)
  const [widthPx, heightPx] = vec.transform([maxX - minX, maxY - minY], viewTransform)

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
      <rect fill={`url(#${id})`} x={minXPx} y={minYPx} width={widthPx} height={-heightPx} />
      <g style={{ transform: "var(--mafs-transform-to-px)" }}>
        {xAxisOverrides !== false && xAxis.axis && (
          <line
            x1={minX}
            x2={maxX}
            y1={0}
            y2={0}
            style={{ stroke: "var(--mafs-origin-color)" }}
            vectorEffect="non-scaling-stroke"
          />
        )}

        {yAxisOverrides !== false && yAxis.axis && (
          <line
            x1={0}
            x2={0}
            y1={minY}
            y2={maxY}
            style={{ stroke: "var(--mafs-origin-color)" }}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </g>

      <g className="mafs-shadow" fill="var(--mafs-fg)">
        {xAxisOverrides !== false && xAxis.labels && (
          <XLabels labelMaker={xAxis.labels} separation={xAxis.lines || 1} />
        )}
        {yAxisOverrides !== false && yAxis.labels && (
          <YLabels labelMaker={yAxis.labels} separation={yAxis.lines || 1} />
        )}
      </g>
    </>
  )
}

export interface LabelsProps {
  separation: number
  labelMaker: LabelMaker
}
const XLabels: React.VFC<LabelsProps> = ({ separation, labelMaker }) => {
  const { viewTransform } = useTransformContext()
  const { xPanes } = usePaneContext()
  const xs = snappedRange(
    xPanes[0][0] - separation,
    xPanes[xPanes.length - 1][1] + separation,
    separation
  ).filter((x) => x !== 0)

  return (
    <g>
      {xs.map((x) => (
        <text
          key={x}
          x={vec.transform([x, 0], viewTransform)[0]}
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
  const { viewTransform: toPx } = useTransformContext()
  const { yPanes } = usePaneContext()
  const ys = snappedRange(
    yPanes[0][0] - separation,
    yPanes[yPanes.length - 1][1] + separation,
    separation
  ).filter((y) => y !== 0)

  return (
    <g>
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
