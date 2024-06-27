import * as React from "react"
import { usePaneContext } from "../../context/PaneContext"
import { Parametric, ParametricProps } from "./Parametric"
import { vec } from "../../vec"

export interface OfYProps extends Omit<ParametricProps, "xy" | "domain" | "t"> {
  x: (y: number) => number
  domain?: vec.Vector2
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function OfY({ x, domain, ...props }: OfYProps) {
  const [yuMin, yuMax] = domain ?? [-Infinity, Infinity]
  const {
    yPaneRange: [ypMin, ypMax],
  } = usePaneContext()
  // Determine the most restrictive range values (either user-provided or the pane context)
  const yMin = Math.max(yuMin, ypMin)
  const yMax = Math.min(yuMax, ypMax)

  const xy = React.useCallback<ParametricProps["xy"]>((y) => [x(y), y], [x])
  const parametricDomain = React.useMemo<vec.Vector2>(() => [yMin, yMax], [yMin, yMax])

  return <Parametric xy={xy} domain={parametricDomain} {...props} />
}

OfY.displayName = "Plot.OfY"
