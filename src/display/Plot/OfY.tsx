import * as React from "react"
import { usePaneContext } from "../../context/PaneContext"
import { Parametric, ParametricProps } from "./Parametric"
import { vec } from "../../vec"

export interface OfYProps extends Omit<ParametricProps, "xy" | "domain" | "t"> {
  x: (y: number) => number
  domain?: {min?: number, max?: number}
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function OfY({ x, domain, ...props }: OfYProps) {
  const {
    yPaneRange: [ypMin, ypMax],
  } = usePaneContext()
  // Determine the most restrictive range values (either user-provided or the pane context)
  const yMin = Math.max(ypMin, domain?.min ?? -Infinity)
  const yMax = Math.min(ypMax, domain?.max ?? Infinity)

  const xy = React.useCallback<ParametricProps["xy"]>((y) => [x(y), y], [x])
  const parametricDomain = React.useMemo<vec.Vector2>(() => [yMin, yMax], [yMin, yMax])

  return <Parametric xy={xy} domain={parametricDomain} {...props} />
}

OfY.displayName = "Plot.OfY"
