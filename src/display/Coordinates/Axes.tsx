import { usePaneContext } from "../../context/PaneContext"
import { useTransformContext } from "../../context/TransformContext"
import { vec } from "../../vec"
import { snappedRange } from "./Cartesian"

export type LabelMaker = (value: number) => React.ReactNode

export interface LabelsProps {
  separation: number
  labelMaker: LabelMaker
}

export type AxisOptions = {
  axis: boolean
  lines: number | false
  labels?: false | LabelMaker
}

export const defaultLabelMaker: LabelMaker = (x) => (
  <>
    {x}
    {x < 0 && <tspan visibility="hidden">-</tspan>}
  </>
)

export const defaultAxisOptions: Partial<AxisOptions> = {
  axis: true,
  lines: 1,
  labels: defaultLabelMaker,
}

export function XLabels({ separation, labelMaker }: LabelsProps) {
  const { viewTransform } = useTransformContext()
  const { xPanes } = usePaneContext()

  return (
    <g className="mafs-axis">
      {xPanes.map(([min, max]) => (
        <g key={`${min},${max}`}>
          {snappedRange(min, max, separation)
            .filter((x) => Math.abs(x) > separation / 1e6)
            .map((x) => (
              <text
                x={vec.transform([x, 0], viewTransform)[0]}
                y={5}
                key={x}
                dominantBaseline="hanging"
                textAnchor="middle"
                style={{ fill: "var(--mafs-origin-color)", paintOrder: "stroke" }}
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

export function YLabels({ separation, labelMaker }: LabelsProps) {
  const { viewTransform } = useTransformContext()
  const { yPanes } = usePaneContext()

  return (
    <g className="mafs-axis">
      {yPanes.map(([min, max]) => (
        <g key={`${min},${max}`}>
          {snappedRange(min, max, separation)
            .filter((y) => Math.abs(y) > separation / 1e6)
            .map((y) => (
              <text
                x={5}
                y={vec.transform([0, y], viewTransform)[1]}
                key={y}
                dominantBaseline="central"
                style={{ fill: "var(--mafs-origin-color)", paintOrder: "stroke" }}
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
