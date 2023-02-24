import * as React from "react"
import { Theme } from "../Theme"
import { sampleInequality } from "./PlotUtils"
import { usePaneContext } from "../../context/PaneContext"

const enum BoundType {
  UNBOUNDED = 0,
  EQUAL,
  INEQUAL,
}

interface BaseInequalityProps {
  color?: string
  weight?: number
  strokeColor?: string
  strokeOpacity?: number
  fillColor?: string
  fillOpacity?: number

  minSamplingDepth?: number
  maxSamplingDepth?: number

  upperColor?: string
  upperOpacity?: number
  upperWeight?: number
  lowerColor?: string
  lowerOpacity?: number
  lowerWeight?: number

  svgUpperPathProps?: React.SVGProps<SVGPathElement>
  svgLowerPathProps?: React.SVGProps<SVGPathElement>
  svgFillPathProps?: React.SVGProps<SVGPathElement>
}

export type InequalityOfXProps = BaseInequalityProps & {
  y: { ">"?: Fn; "<"?: Fn; ">="?: Fn; "<="?: Fn }
}

export type InequalityOfYProps = BaseInequalityProps & {
  x: { ">"?: Fn; "<"?: Fn; ">="?: Fn; "<="?: Fn }
}

export function InequalityOfX({
  y,
  color = Theme.foreground,
  weight = 2,
  strokeColor = color,
  strokeOpacity = 1.0,
  fillColor = color,
  fillOpacity = 0.15,

  minSamplingDepth = 10,
  maxSamplingDepth = 14,

  upperColor = strokeColor,
  upperOpacity = strokeOpacity,
  upperWeight = weight,
  lowerColor = strokeColor,
  lowerOpacity = strokeOpacity,
  lowerWeight = weight,

  svgUpperPathProps = {},
  svgLowerPathProps = {},
  svgFillPathProps = {},
}: InequalityOfXProps) {
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

  const svgPath = sampleInequality(
    upperFn,
    lowerFn,
    [xMin, xMax],
    minSamplingDepth,
    maxSamplingDepth,
    0.1
  )

  return (
    <g>
      <path
        d={svgPath.fill}
        style={{
          fill: fillColor || "var(--mafs-fg)",
          fillOpacity,
          stroke: "none",
          transform: "var(--mafs-view-transform)",
          vectorEffect: "non-scaling-stroke",
          ...svgFillPathProps?.style,
        }}
        {...svgFillPathProps}
      />

      {upperBoundType != BoundType.UNBOUNDED && (
        <path
          d={svgPath.upper}
          strokeWidth={upperWeight}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={upperBoundType === BoundType.INEQUAL ? "4,8" : ""}
          style={{
            fill: "none",
            stroke: upperColor,
            strokeOpacity: upperOpacity,
            transform: "var(--mafs-view-transform)",
            vectorEffect: "non-scaling-stroke",
            ...svgUpperPathProps?.style,
          }}
          {...svgUpperPathProps}
        />
      )}

      {lowerBoundType != BoundType.UNBOUNDED && (
        <path
          d={svgPath.lower}
          strokeWidth={lowerWeight}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={lowerBoundType === BoundType.INEQUAL ? "4,8" : ""}
          style={{
            fill: "none",
            stroke: lowerColor,
            strokeOpacity: lowerOpacity,
            transform: "var(--mafs-view-transform)",
            vectorEffect: "non-scaling-stroke",
            ...svgLowerPathProps?.style,
          }}
          {...svgLowerPathProps}
        />
      )}
    </g>
  )
}

export function Inequality({
  y,
  color = Theme.foreground,
  weight = 2,
  strokeColor = color,
  strokeOpacity = 1.0,
  fillColor = color,
  fillOpacity = 0.15,

  minSamplingDepth = 10,
  maxSamplingDepth = 14,

  upperColor = strokeColor,
  upperOpacity = strokeOpacity,
  upperWeight = weight,
  lowerColor = strokeColor,
  lowerOpacity = strokeOpacity,
  lowerWeight = weight,

  svgUpperPathProps = {},
  svgLowerPathProps = {},
  svgFillPathProps = {},
}: InequalityOfXProps) {
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

  const svgPath = sampleInequality(
    upperFn,
    lowerFn,
    [xMin, xMax],
    minSamplingDepth,
    maxSamplingDepth,
    0.1
  )

  return (
    <g>
      <path
        d={svgPath.fill}
        style={{
          fill: fillColor || "var(--mafs-fg)",
          fillOpacity,
          stroke: "none",
          transform: "var(--mafs-view-transform)",
          vectorEffect: "non-scaling-stroke",
          ...svgFillPathProps?.style,
        }}
        {...svgFillPathProps}
      />

      {upperBoundType != BoundType.UNBOUNDED && (
        <path
          d={svgPath.upper}
          strokeWidth={upperWeight}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={upperBoundType === BoundType.INEQUAL ? "4,8" : ""}
          style={{
            fill: "none",
            stroke: upperColor,
            strokeOpacity: upperOpacity,
            transform: "var(--mafs-view-transform)",
            vectorEffect: "non-scaling-stroke",
            ...svgUpperPathProps?.style,
          }}
          {...svgUpperPathProps}
        />
      )}

      {lowerBoundType != BoundType.UNBOUNDED && (
        <path
          d={svgPath.lower}
          strokeWidth={lowerWeight}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={lowerBoundType === BoundType.INEQUAL ? "4,8" : ""}
          style={{
            fill: "none",
            stroke: lowerColor,
            strokeOpacity: lowerOpacity,
            transform: "var(--mafs-view-transform)",
            vectorEffect: "non-scaling-stroke",
            ...svgLowerPathProps?.style,
          }}
          {...svgLowerPathProps}
        />
      )}
    </g>
  )
}
