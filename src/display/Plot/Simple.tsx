import * as React from "react"
import { usePaneContext } from "../../context/PaneContext"
import { Parametric, ParametricProps } from "./Parametric"
import { vec } from "../../vec"

export interface OfXProps extends Omit<ParametricProps, "xy" | "t"> {
  y: (x: number) => number
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function OfX({ y, ...props }: OfXProps) {
  const {
    xPaneRange: [xMin, xMax],
  } = usePaneContext()

  const xy = React.useCallback<ParametricProps["xy"]>((x) => [x, y(x)], [y])
  const t = React.useMemo<vec.Vector2>(() => [xMin, xMax], [xMin, xMax])

  return <Parametric xy={xy} t={t} {...props} />
}

OfX.displayName = "Plot.OfX"

export interface OfYProps extends Omit<ParametricProps, "xy" | "t"> {
  x: (y: number) => number
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function OfY({ x, ...props }: OfYProps) {
  const {
    yPaneRange: [yMin, yMax],
  } = usePaneContext()

  const xy = React.useCallback<ParametricProps["xy"]>((y) => [x(y), y], [x])
  const t = React.useMemo<vec.Vector2>(() => [yMin, yMax], [yMin, yMax])

  return <Parametric xy={xy} t={t} {...props} />
}

OfY.displayName = "Plot.OfY"
