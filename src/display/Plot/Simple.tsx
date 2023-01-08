import * as React from "react"
import { usePaneContext } from "../../view/PaneManager"
import { Parametric, ParametricProps } from "./Parametric"
import * as vec from "../../vec"

export interface OfXProps extends Omit<ParametricProps, "xy" | "t"> {
  y: (x: number) => number
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function OfX({ y, ...props }: OfXProps) {
  const {
    xPaneRange: [xMin, xMax],
  } = usePaneContext()

  const xy = React.useCallback<ParametricProps["xy"]>(
    (x, v) => {
      v[0] = x
      v[1] = y(x)
      return v
    },
    [y]
  )

  const t = React.useMemo<vec.Vector2>(() => [xMin, xMax], [xMin, xMax])

  return <Parametric xy={xy} t={t} {...props} />
}

export interface OfYProps extends Omit<ParametricProps, "xy" | "t"> {
  x: (y: number) => number
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function OfY({ x, ...props }: OfYProps) {
  const {
    yPaneRange: [yMin, yMax],
  } = usePaneContext()

  const xy = React.useCallback<ParametricProps["xy"]>(
    (y, v) => {
      v[0] = x(y)
      v[1] = y
      return v
    },
    [x]
  )

  const t = React.useMemo<vec.Vector2>(() => [yMin, yMax], [yMin, yMax])

  return <Parametric xy={xy} t={t} {...props} />
}
