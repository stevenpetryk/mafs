import * as React from "react"
import { range, round } from "../math"
import { usePaneContext } from "../context/PaneContext"
import { useTransformContext } from "../context/TransformContext"
import { vec } from "../vec"
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
      <g style={{ transform: "var(--mafs-view-transform)" }}>
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

CartesianCoordinates.displayName = "CartesianCoordinates"

export interface LabelsProps {
  separation: number
  labelMaker: LabelMaker
}
function XLabels({ separation, labelMaker }: LabelsProps) {
  const { viewTransform } = useTransformContext()
  const { xPanes } = usePaneContext()

  return (
    <g>
      {xPanes.map(([min, max]) => (
        <g key={`${min},${max}`}>
          {range(min, max - separation, separation)
            .filter((x) => x)
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
    <g>
      {yPanes.map(([min, max]) => (
        <g key={`${min},${max}`}>
          {range(min, max - separation, separation)
            .filter((y) => y)
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

export function autoPi(x: number): string {
  if (x === 0) return "0"
  if (Math.abs(Math.PI - x) < 0.001) return "π"
  if (Math.abs(-Math.PI - x) < 0.001) return "-π"
  return `${round(x / Math.PI, 5)}π`
}
