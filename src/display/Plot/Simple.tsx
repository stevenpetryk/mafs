import * as React from "react"
import { usePaneContext } from "../../view/PaneManager"
import { Parametric, ParametricProps } from "./Parametric"

export interface OfXProps extends Omit<ParametricProps, "xy" | "t"> {
  y: (x: number) => number
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function OfX({ y, ...props }: OfXProps) {
  const {
    xPaneRange: [xMin, xMax],
  } = usePaneContext()

  return (
    <Parametric
      xy={(x, v) => {
        v[0] = x
        v[1] = y(x)
        return v
      }}
      t={[xMin, xMax]}
      {...props}
    />
  )
}

export interface OfYProps extends Omit<ParametricProps, "xy" | "t"> {
  x: (y: number) => number
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function OfY({ x, ...props }: OfYProps) {
  const {
    yPaneRange: [yMin, yMax],
  } = usePaneContext()

  return (
    <Parametric
      xy={(y, v) => {
        v[0] = x(y)
        v[1] = y
        return v
      }}
      t={[yMin, yMax]}
      {...props}
    />
  )
}
