import { usePaneContext } from "../../context/PaneContext"
import { useTransformContext } from "../../context/TransformContext"
import { range, round } from "../../math"
import { vec } from "../../vec"
import { AxisOptions, XLabels, YLabels, defaultAxisOptions } from "./Axes"

// This is sort of a hack—every SVG pattern on a page needs a unique ID, otherwise they conflict.
let incrementer = 0

type GridAxisOptions = Partial<AxisOptions & { subdivisions: number | false }>

export interface DotCoordinatesProps {
    xAxis?: GridAxisOptions | false
    yAxis?: GridAxisOptions | false
    subdivisions?: number | false
}

export function Dot({
    xAxis: xAxisOverrides,
    yAxis: yAxisOverrides,
    subdivisions = false,
}: DotCoordinatesProps) {
    const xAxisEnabled = xAxisOverrides !== false
    const yAxisEnabled = yAxisOverrides !== false

    const xAxis = { subdivisions, ...defaultAxisOptions, ...xAxisOverrides } as GridAxisOptions
    const yAxis = { subdivisions, ...defaultAxisOptions, ...yAxisOverrides } as GridAxisOptions

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

    const dotRadius = 1.5
    const subDotRadius = 0.7

    return (
        <g fill="none">
            <pattern x={0} y={0} width={unitW} height={unitH} id={id} patternUnits="userSpaceOnUse">
                <pattern
                    width={subUnitW}
                    height={subUnitH}
                    id={`${id}-subdivision`}
                    patternUnits="userSpaceOnUse"
                >
                    <g stroke="var(--grid-line-subdivision-color)" fill="var(--grid-line-subdivision-color)">
                        <circle cx={0} cy={0} r={subDotRadius} />
                        <circle cx={subUnitW} cy={0} r={subDotRadius} />
                        <circle cx={0} cy={subUnitH} r={subDotRadius} />
                        <circle cx={subUnitW} cy={subUnitH} r={subDotRadius} />
                    </g>
                </pattern>


                <rect width={unitW} height={unitH} fill={`url(#${id}-subdivision)`} />

                <g stroke="var(--mafs-line-color)" fill="var(--mafs-line-color)">
                    <circle cx={0} cy={0} r={dotRadius} />
                    <circle cx={unitW} cy={0} r={dotRadius} />
                    <circle cx={0} cy={unitH} r={dotRadius} />
                    <circle cx={unitW} cy={unitH} r={dotRadius} />
                </g>
            </pattern>

            <rect x={vxMin} y={vyMax} width={vxMax - vxMin} height={vyMin - vyMax} fill={`url(#${id})`} />

            <g stroke="var(--mafs-origin-color)">
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
