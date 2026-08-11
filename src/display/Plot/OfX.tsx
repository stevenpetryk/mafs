import * as React from "react"
import { usePaneContext } from "../../context/PaneContext"
import { Parametric, ParametricProps } from "./Parametric"
import { vec } from "../../vec"

export interface OfXProps extends Omit<ParametricProps, "xy" | "domain" | "t"> {
  y: (x: number) => number
  domain?: vec.Vector2
  svgPathProps?: React.SVGProps<SVGPathElement>
}

export function OfX({ y, domain, ...props }: OfXProps) {
  const [xuMin, xuMax] = domain ?? [-Infinity, Infinity]
  const {
    xPaneRange: [xpMin, xpMax],
  } = usePaneContext()
  // Determine the most restrictive range values (either user-provided or the pane context)
  const xMin = Math.max(xuMin, xpMin)
  const xMax = Math.min(xuMax, xpMax)

  const xy = React.useCallback<ParametricProps["xy"]>((x) => [x, y(x)], [y])
  const parametricDomain = React.useMemo<vec.Vector2>(() => [xMin, xMax], [xMin, xMax])

  // A user domain can be completely outside the visible pane. Passing an
  // inverted domain to the sampler produces a backwards path instead of
  // culling the plot, which becomes especially noticeable while panning.
  if (xMin > xMax) return null

  return <Parametric xy={xy} domain={parametricDomain} {...props} />
}

OfX.displayName = "Plot.OfX"
