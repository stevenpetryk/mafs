import * as React from "react"
import { Theme } from "../Theme"
import { sampleInequality } from "./PlotUtils"
import { usePaneContext } from "../../context/PaneContext"
import invariant from "tiny-invariant"
import { vec } from "../../vec"

const enum BoundType {
  UNBOUNDED = 0,
  EQUAL,
  INEQUAL,
}

type FnX = ((x: number) => number) | number
type FnY = ((y: number) => number) | number

export interface InequalityProps {
  y?: { ">"?: FnX; "<="?: FnX; "<"?: FnX; ">="?: FnX }
  x?: { ">"?: FnY; "<="?: FnY; "<"?: FnY; ">="?: FnY }
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

export function Inequality({
  x,
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
}: InequalityProps) {
  const {
    xPaneRange: [xMin, xMax],
    yPaneRange: [yMin, yMax],
  } = usePaneContext()

  const domain: vec.Vector2 = y ? [xMin, xMax] : [yMin, yMax]
  const range: vec.Vector2 = y ? [yMin, yMax] : [xMin, xMax]
  const fn = y ? y : x

  invariant(
    fn && (x === undefined) !== (y === undefined),
    "You must pass either an x or y set of functions to Inequality (but not both)",
  )

  // Make sure only valid combinations of inequality operators are passed
  invariant(
    (fn["<"] === undefined || fn["<="] === undefined) &&
      (fn[">"] === undefined || fn[">="] === undefined),
    "You cannot pass both an inequality and an equality operator to Inequality",
  )

  let upperBoundType = BoundType.UNBOUNDED
  if ("<=" in fn) upperBoundType = BoundType.EQUAL
  if ("<" in fn) upperBoundType = BoundType.INEQUAL

  let lowerBoundType = BoundType.UNBOUNDED
  if (">=" in fn) lowerBoundType = BoundType.EQUAL
  if (">" in fn) lowerBoundType = BoundType.INEQUAL

  let greaterFn = fn["<"] ?? fn["<="] ?? (() => range[1])
  let lesserFn = fn[">"] ?? fn[">="] ?? (() => range[0])

  if (typeof greaterFn === "number") {
    const greater = greaterFn
    greaterFn = () => greater
  }
  if (typeof lesserFn === "number") {
    const lesser = lesserFn
    lesserFn = () => lesser
  }

  const svgPath = sampleInequality(
    y ? "x" : "y",
    greaterFn,
    lesserFn,
    domain,
    minSamplingDepth,
    maxSamplingDepth,
    0.1,
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

Inequality.displayName = "Plot.Inequality"
