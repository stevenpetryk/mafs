import * as React from "react"
import { vec } from "../../vec"
import { Filled } from "../Theme"
import { adaptiveSamplingBetween } from "./PlotUtils"
import { usePaneContext } from "../../context/PaneContext"

const enum BoundType {
  UNBOUNDED = 0,
  EQUAL,
  INEQUAL,
}

type Fn = (x: number) => number

export interface InequalityProps extends Omit<Filled, "strokeStyle"> {
  /** A function that takes a `t` value and returns a point. */
  y: { ">"?: Fn; "<"?: Fn; ">="?: Fn; "<="?: Fn }

  svgGroupProps?: React.SVGProps<SVGGElement>
}

export function Inequality({
  y,
  color,
  weight = 2,
  strokeOpacity = 1,
  fillOpacity = 0.2,
  svgGroupProps,
}: InequalityProps) {
  const {
    xPaneRange: [xMin, xMax],
    yPaneRange: [yMin, yMax],
  } = usePaneContext()

  let upperBoundType = BoundType.UNBOUNDED
  if ("<=" in y) upperBoundType = BoundType.EQUAL
  if ("<" in y) upperBoundType = BoundType.INEQUAL

  let lowerBoundType = BoundType.UNBOUNDED
  if (">=" in y) lowerBoundType = BoundType.EQUAL
  if (">" in y) lowerBoundType = BoundType.INEQUAL

  const upperFn = y["<"] ?? y["<="] ?? (() => yMax)

  const lowerFn = y[">"] ?? y[">="] ?? (() => yMin)

  const tPos = React.useMemo<vec.Vector2>(() => [xMin, xMax], [xMin, xMax])

  const svgPath = adaptiveSamplingBetween(upperFn, lowerFn, tPos, 12, 20, 0.1)

  return (
    <g {...svgGroupProps}>
      <path
        d={svgPath.fill}
        style={{
          fill: color || "var(--mafs-fg)",
          fillOpacity,
          stroke: "none",
          transform: "var(--mafs-view-transform)",
          vectorEffect: "non-scaling-stroke",
        }}
      />

      {upperBoundType != BoundType.UNBOUNDED && (
        <path
          d={svgPath.upper}
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={upperBoundType === BoundType.INEQUAL ? "4,8" : ""}
          style={{
            fill: "none",
            stroke: color || "var(--mafs-fg)",
            strokeOpacity: strokeOpacity,
            transform: "var(--mafs-view-transform)",
            vectorEffect: "non-scaling-stroke",
          }}
        />
      )}

      {lowerBoundType != BoundType.UNBOUNDED && (
        <path
          d={svgPath.lower}
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={lowerBoundType === BoundType.INEQUAL ? "4,8" : ""}
          style={{
            fill: "none",
            stroke: color || "var(--mafs-fg)",
            strokeOpacity: strokeOpacity,
            transform: "var(--mafs-view-transform)",
            vectorEffect: "non-scaling-stroke",
          }}
        />
      )}
    </g>
  )
}
