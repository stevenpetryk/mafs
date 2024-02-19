import { usePaneContext } from "../../context/PaneContext"
import { useTransformContext } from "../../context/TransformContext"
import { range } from "../../math"
import { vec } from "../../vec"
import { XLabels, YLabels, defaultLabelMaker, AxisOptions, defaultAxisOptions } from "./Axes"

const thetas = range(0, 2 * Math.PI, Math.PI / 12)

export interface PolarCoordinatesProps {
  xAxis?: Partial<AxisOptions> | false
  yAxis?: Partial<AxisOptions> | false
  lines?: number
  subdivisions?: number
}

export function PolarCoordinates({
  xAxis: xAxisOverrides,
  yAxis: yAxisOverrides,
  lines = 1,
  subdivisions,
}: PolarCoordinatesProps) {
  const xAxisEnabled = xAxisOverrides !== false
  const yAxisEnabled = yAxisOverrides !== false

  const xAxis = { ...defaultAxisOptions, ...xAxisOverrides } as AxisOptions
  const yAxis = { ...defaultAxisOptions, ...yAxisOverrides } as AxisOptions

  const { viewTransform } = useTransformContext()
  const { xPaneRange, yPaneRange } = usePaneContext()

  const [xMin, xMax] = xPaneRange
  const [yMin, yMax] = yPaneRange

  const distances = [
    vec.mag([xMin, yMin]),
    vec.mag([xMin, yMax]),
    vec.mag([xMax, yMin]),
    vec.mag([xMax, yMax]),
    vec.mag([(xMin + xMax) / 2, (yMin + yMax) / 2]),
  ]
  const b = lines

  const closeToOrigin = Math.min(...distances) < Math.max(xMax - xMin, yMax - yMin)
  const minRadiusPrecise = closeToOrigin ? 0 : Math.min(...distances)
  const maxRadiusPrecise = Math.max(...distances)

  const minRadius = Math.floor(minRadiusPrecise / b) * b
  const maxRadius = Math.ceil(maxRadiusPrecise / b) * b

  const [vxMin, vyMin] = vec.transform([xMin, yMin], viewTransform)
  const [vxMax, vyMax] = vec.transform([xMax, yMax], viewTransform)

  const [scaleX, scaleY] = vec.transform([1, -1], viewTransform)

  const rs = range(minRadius, maxRadius, b)
  const subRs = subdivisions != undefined ? range(minRadius, maxRadius, b / subdivisions) : []

  return (
    <g fill="none">
      <g stroke="var(--grid-line-subdivision-color)">
        {thetas.map((theta) => (
          <line
            key={theta}
            x1={0}
            y1={0}
            x2={Math.cos(theta) * maxRadius * scaleX}
            y2={-Math.sin(theta) * maxRadius * scaleY}
          />
        ))}
      </g>

      {subRs.map((r) => (
        <ellipse
          data-r={r}
          key={r}
          cx={0}
          cy={0}
          rx={r * scaleX}
          ry={r * scaleY}
          stroke="var(--grid-line-subdivision-color)"
        />
      ))}

      {rs.map((r) => (
        <ellipse
          data-r={r}
          key={r}
          cx={0}
          cy={0}
          rx={r * scaleX}
          ry={r * scaleY}
          stroke="var(--mafs-line-color)"
        />
      ))}

      <g stroke="var(--mafs-origin-color)">
        {xAxisEnabled && xAxis.axis && <line x1={vxMin} y1={0} x2={vxMax} y2={0} />}
        {yAxisEnabled && yAxis.axis && <line x1={0} y1={vyMin} x2={0} y2={vyMax} />}
      </g>

      <g className="mafs-shadow">
        {xAxisEnabled && xAxis.labels && (
          <XLabels
            separation={xAxisOverrides?.lines || lines || 1}
            labelMaker={xAxis.labels || defaultLabelMaker}
          />
        )}
        {yAxisEnabled && yAxis.labels && (
          <YLabels
            separation={yAxisOverrides?.lines || lines || 1}
            labelMaker={yAxis.labels || defaultLabelMaker}
          />
        )}
      </g>
    </g>
  )
}

PolarCoordinates.displayName = "Coordinates.Polar"
