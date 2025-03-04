import * as React from "react"
import { pickClosestToValue, range, round, roundToNearestPowerOf10 } from "../../math"
import { usePaneContext } from "../../context/PaneContext"
import { useTransformContext } from "../../context/TransformContext"
import { vec } from "../../vec"
import { XLabels, YLabels, AxisOptions, defaultAxisOptions } from "./Axes"
import { useSpanContext } from "../../context/SpanContext"

// This is sort of a hack—every SVG pattern on a page needs a unique ID, otherwise they conflict.
let incrementer = 0

type GridAxisOptions = Partial<AxisOptions & { subdivisions: number | false }>

export interface CartesianCoordinatesProps {
  xAxis?: GridAxisOptions | false | "auto"
  yAxis?: GridAxisOptions | false | "auto"
  subdivisions?: number | false
}

export function Cartesian({
  xAxis: xAxisProp,
  yAxis: yAxisProp,
  subdivisions = false,
}: CartesianCoordinatesProps) {
  const xAxisEnabled = xAxisProp !== false
  const yAxisEnabled = yAxisProp !== false

  // Better name? Also `3.5` is a magic number that makes it feel right to me,
  // it could have any other value (and perhaps it should be computed).
  // It *kind of* represents how many major grid lines can be on screen at once,
  // e.g. if it's 4 then there can be at most 4 major gridlines on the canvas.
  //
  // it seems like its behavior isn't quite that simple but it roughly explains why we divide at all here

  const mathWidth = useSpanContext().xSpan / 3.5

  const nearestPowerOf10 = roundToNearestPowerOf10(mathWidth)

  // This should be a prop or something later, just a constant right now
  const multiples = [
    { value: 1, subdivisions: 5 },
    { value: 2, subdivisions: 4 },
    { value: 5, subdivisions: 5 },
  ]

  const autoClosest = pickClosestToValue(
    mathWidth,
    multiples.map((multiple) => nearestPowerOf10 * multiple.value),
  )

  const autoLines = autoClosest[0]
  const autoSubdivisions = multiples[autoClosest[1]].subdivisions

  const xAxisOverrides =
    xAxisProp === "auto"
      ? { lines: autoLines, subdivisions: autoSubdivisions }
      : xAxisProp !== false
        ? xAxisProp
        : false
  const yAxisOverrides =
    yAxisProp === "auto"
      ? { lines: autoLines, subdivisions: autoSubdivisions }
      : yAxisProp !== false
        ? yAxisProp
        : false

  const xAxis = {
    subdivisions,
    ...defaultAxisOptions,
    ...xAxisOverrides,
  } as GridAxisOptions
  const yAxis = {
    subdivisions,
    ...defaultAxisOptions,
    ...yAxisOverrides,
  } as GridAxisOptions

  const id = React.useMemo(() => `cartesian-${incrementer++}`, [])

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
            {xAxisEnabled !== false && xSubs > 1 && (
              <>
                <line x1={0} y1={0} x2={0} y2={subUnitH} />
                <line x1={subUnitW} y1={0} x2={subUnitW} y2={subUnitH} />
              </>
            )}
            {yAxisEnabled !== false && ySubs > 1 && (
              <>
                <line x1={0} y1={0} x2={subUnitW} y2={0} />
                <line x1={0} y1={subUnitH} x2={subUnitW} y2={subUnitH} />
              </>
            )}
          </g>
        </pattern>

        <rect width={unitW} height={unitH} fill={`url(#${id}-subdivision)`} />

        <g stroke="var(--mafs-line-color)">
          {yAxisEnabled && xAxis.lines && (
            <>
              <line x1={0} y1={0} x2={unitW} y2={0} />
              <line x1={0} y1={unitH} x2={unitW} y2={unitH} />
            </>
          )}
          {xAxisEnabled && yAxis.lines && (
            <>
              <line x1={0} y1={0} x2={0} y2={unitH} />
              <line x1={unitW} y1={0} x2={unitW} y2={unitH} />
            </>
          )}
        </g>
      </pattern>

      <rect x={vxMin} y={vyMax} width={vxMax - vxMin} height={vyMin - vyMax} fill={`url(#${id})`} />

      <g stroke="var(--mafs-origin-color)" strokeWidth="var(--mafs-axis-stroke-width)">
        {xAxisEnabled && xAxis.axis && <line x1={vxMin} y1={0} x2={vxMax} y2={0} />}
        {yAxisEnabled && yAxis.axis && <line x1={0} y1={vyMin} x2={0} y2={vyMax} />}
      </g>

      <g className="mafs-shadow">
        {xAxisEnabled && xAxis.labels && (
          <XLabels separation={xAxis.lines || 1} labelMaker={xAxis.labels} />
        )}
        {yAxisEnabled && yAxis.labels && (
          <YLabels separation={yAxis.lines || 1} labelMaker={yAxis.labels} />
        )}
      </g>
    </g>
  )
}

Cartesian.displayName = "Coordinates.Cartesian"

export function snappedRange(min: number, max: number, step: number) {
  const roundMin = Math.floor(min / step) * step
  const roundMax = Math.ceil(max / step) * step

  if (roundMin === roundMax - step) return [roundMin]
  return range(roundMin, roundMax - step, step)
}

export function autoPi(x: number): string {
  if (x === 0) return "0"
  if (Math.abs(Math.PI - x) < 0.001) return "π"
  if (Math.abs(-Math.PI - x) < 0.001) return "-π"
  return `${round(x / Math.PI, 5)}π`
}
