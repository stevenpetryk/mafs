import * as React from "react"
import { usePaneContext } from "../../context/PaneContext"
import { Parametric, ParametricProps } from "./Parametric"
import { vec } from "../../vec"

export interface OfXProps extends Omit<ParametricProps, "xy" | "domain" | "t"> {
  y: (x: number) => number
  domain?: {min?: number, max?: number}
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function OfX({ y, domain, ...props }: OfXProps) {
  const {
    xPaneRange: [xpMin, xpMax],
  } = usePaneContext()
  // Determine the most restrictive range values (either user-provided or the pane context)
  const xMin = Math.max(xpMin, domain?.min ?? -Infinity)
  const xMax = Math.min(xpMax, domain?.max ?? Infinity)

  const xy = React.useCallback<ParametricProps["xy"]>((x) => [x, y(x)], [y])
  const parametricDomain = React.useMemo<vec.Vector2>(() => [xMin, xMax], [xMin, xMax])

  return <Parametric xy={xy} domain={parametricDomain} {...props} />
}

OfX.displayName = "Plot.OfX"
