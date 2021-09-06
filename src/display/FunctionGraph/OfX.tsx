import React, { useCallback, useMemo } from "react"
import round from "lodash.round"
import { usePaneContext } from "../../view/PaneManager"
import { Stroked } from "../../display/Theme"
import { useScaleContext } from "../../view/ScaleContext"

export interface OfXProps extends Stroked {
  y: (x: number) => number
  quality?: "low" | "medium" | "high"
  svgPathProps?: React.SVGProps<SVGPathElement>
}

const OfX: React.VFC<OfXProps> = ({
  y,
  color,
  quality = "low",
  weight = 3,
  opacity = 1,
  style,
  svgPathProps = {},
}) => {
  const { cssScale } = useScaleContext()
  const { xPanes: panes, yPaneRange } = usePaneContext()

  // Ignore points that are very high or low
  const yUpperBound = yPaneRange[1]
  const yLowerBound = yPaneRange[0]

  let subsampling: number
  switch (quality) {
    case "low":
      subsampling = 0.5
      break
    case "medium":
      subsampling = 1
      break
    case "high":
      subsampling = 2
      break
  }

  const getSegment = useCallback(
    (min: number, max: number) => {
      const dx = (max - min) / (500 * subsampling)

      let points = ""

      for (let x = min; x <= max; x += dx) {
        const yx = y(x)
        if (yx <= yUpperBound && yx >= yLowerBound) {
          points += ` ${round(x, 3)} ${round(yx, 3)} `
        }
      }

      return points
    },
    [y, yLowerBound, yUpperBound, subsampling]
  )

  const d = useMemo(
    () => `M ${panes.map(([min, max]) => getSegment(min, max)).join(" ")}`,
    [panes, getSegment]
  )

  return (
    <path
      d={d}
      strokeWidth={weight}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={style === "dashed" ? "3,8" : undefined}
      transform={cssScale}
      {...svgPathProps}
      style={{
        stroke: color || "var(--mafs-fg)",
        opacity,
        vectorEffect: "non-scaling-stroke",
        ...(svgPathProps?.style || {}),
      }}
    />
  )
}

export default OfX
