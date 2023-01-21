import * as React from "react"
import { range, round } from "../math"
import { usePaneContext } from "../context/PaneContext"
import { useTransformContext } from "../context/TransformContext"
import { vec } from "../vec"

export type LabelMaker = (value: number) => React.ReactNode

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
  labels: (x) => {
    return x
    // return (
    //   <>
    //     {x}
    //     {x < 0 && <tspan visibility="hidden">-</tspan>}
    //   </>
    // )
  },
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

  const id = `cartesian-${incrementer++}`

  const { viewTransform } = useTransformContext()
  const { xPaneRange, yPaneRange } = usePaneContext()

  const [xMin, xMax] = xPaneRange
  const [yMin, yMax] = yPaneRange

  const [vxMin, vyMin] = vec.transform([xMin, yMin], viewTransform)
  const [vxMax, vyMax] = vec.transform([xMax, yMax], viewTransform)

  const xLines = xAxis.lines || 1
  const yLines = yAxis.lines || 1

  const [unitW, unitH] = vec.transform([xLines, -yLines], viewTransform)

  const xSubs = xAxis.subdivisions || 1
  const ySubs = yAxis.subdivisions || 1

  const subUnitW = unitW / xSubs
  const subUnitH = unitH / ySubs

  return (
    <g fill="none">
      <pattern x={0} y={0} width={unitW} height={unitH} id={id} patternUnits="userSpaceOnUse">
        <pattern
          width={subUnitW}
          height={subUnitH}
          id={`${id}-subdivision`}
          patternUnits="userSpaceOnUse"
        >
          <g stroke="var(--grid-line-subdivision-color)">
            {xSubs > 1 && (
              <>
                <line x1={0} y1={0} x2={0} y2={subUnitH} />
                <line x1={subUnitW} y1={0} x2={subUnitW} y2={subUnitH} />
              </>
            )}
            {ySubs > 1 && (
              <>
                <line x1={0} y1={0} x2={subUnitW} y2={0} />
                <line x1={0} y1={subUnitH} x2={subUnitW} y2={subUnitH} />
              </>
            )}
          </g>
        </pattern>

        <rect
          width={unitW}
          height={unitH}
          stroke="var(--mafs-line-color)"
          fill={`url(#${id}-subdivision)`}
        />
      </pattern>

      <rect x={vxMin} y={vyMax} width={vxMax - vxMin} height={vyMin - vyMax} fill={`url(#${id})`} />

      <g stroke="var(--mafs-origin-color)">
        {xAxis.axis && <line x1={vxMin} y1={0} x2={vxMax} y2={0} />}
        {yAxis.axis && <line x1={0} y1={vyMin} x2={0} y2={vyMax} />}
      </g>

      <g className="mafs-shadow">
        {xAxis.labels && <XLabels separation={xAxis.lines || 1} labelMaker={xAxis.labels} />}
        {yAxis.labels && <YLabels separation={yAxis.lines || 1} labelMaker={yAxis.labels} />}
      </g>
    </g>
  )
}

CartesianCoordinates.displayName = "CartesianCoordinates"

export interface LabelsProps {
  separation: number
  labelMaker: LabelMaker
}
function XLabels({ separation, labelMaker }: LabelsProps) {
  const { viewTransform } = useTransformContext()
  const { xPanes } = usePaneContext()

  return (
    <g className="mafs-axis">
      {xPanes.map(([min, max]) => (
        <g key={`${min},${max}`}>
          {snappedRange(min, max - separation, separation)
            .filter((x) => Math.abs(x) > separation / 1e6)
            .map((x) => (
              <text
                x={vec.transform([x, 0], viewTransform)[0]}
                y={5}
                key={x}
                dominantBaseline="hanging"
                textAnchor="middle"
              >
                {labelMaker(x)}
              </text>
            ))}
        </g>
      ))}
    </g>
  )
}

XLabels.displayName = "CartesianCoordinates.XLabels"

function YLabels({ separation, labelMaker }: LabelsProps) {
  const { viewTransform } = useTransformContext()
  const { yPanes } = usePaneContext()

  return (
    <g className="mafs-axis">
      {yPanes.map(([min, max]) => (
        <g key={`${min},${max}`}>
          {snappedRange(min, max - separation, separation)
            .filter((y) => Math.abs(y) > separation / 1e6)
            .map((y) => (
              <text
                x={5}
                y={vec.transform([0, y], viewTransform)[1]}
                key={y}
                dominantBaseline="central"
              >
                {labelMaker(y)}
              </text>
            ))}
        </g>
      ))}
    </g>
  )
}

YLabels.displayName = "CartesianCoordinates.YLabels"

function snappedRange(min: number, max: number, step: number) {
  return range(Math.floor(min / step) * step, Math.ceil(max / step) * step, step)
}

export function autoPi(x: number): string {
  if (x === 0) return "0"
  if (Math.abs(Math.PI - x) < 0.001) return "π"
  if (Math.abs(-Math.PI - x) < 0.001) return "-π"
  return `${round(x / Math.PI, 5)}π`
}
