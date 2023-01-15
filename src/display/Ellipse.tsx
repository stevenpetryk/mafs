import * as React from "react"
import { Filled, Theme } from "./Theme"
import { useViewTransform } from "../context/ViewTransformContext"
import { Vector2 } from "../vec"
import { useUserTransform } from "../context/UserTransformContext"
import * as vec from "../vec"
import * as math from "../math"

export interface EllipseProps extends Filled {
  center: Vector2
  radius: Vector2
  angle?: number
  svgEllipseProps?: React.SVGProps<SVGEllipseElement>
}

export const Ellipse: React.VFC<EllipseProps> = ({
  center,
  radius,
  angle = 0,
  strokeStyle = "solid",
  strokeOpacity = 1.0,
  weight = 2,
  color = Theme.foreground,
  fillOpacity = 0.15,
  svgEllipseProps = {},
}) => {
  const { toPx } = useViewTransform()
  const userTransform = useUserTransform()

  const transform = vec
    .matrixBuilder()
    .translate(...center)
    .mult(userTransform)
    .scale(1, -1)
    .mult(toPx)
    .scale(1, -1)
    .get()

  const cssTransform = `
    ${math.matrixToCSSTransform(transform)}
    rotate(${angle * (180 / Math.PI)})
  `

  return (
    <ellipse
      cx={0}
      cy={0}
      rx={radius[0]}
      ry={radius[1]}
      strokeWidth={weight}
      strokeDasharray={strokeStyle === "dashed" ? "4,3" : undefined}
      transform={cssTransform}
      {...svgEllipseProps}
      style={{
        stroke: color,
        fill: color,
        fillOpacity,
        strokeOpacity,
        vectorEffect: "non-scaling-stroke",
        ...(svgEllipseProps.style || {}),
      }}
    />
  )
}
