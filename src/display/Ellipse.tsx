import * as React from "react"
import { Filled, Theme } from "./Theme"
import { useScaleContext } from "../view/ScaleContext"
import { Vector2 } from "../vec"
import { useTransformContext } from "./Transform"
import * as vec from "../vec"

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
  const { pixelMatrix } = useScaleContext()
  const contextTransform = useTransformContext()

  const transform = vec
    .matrixBuilder()
    .translate(...center)
    .mult(contextTransform)
    .scale(1, -1)
    .mult(pixelMatrix)
    .scale(1, -1)
    .get()

  const [a, c, tx, b, d, ty] = transform
  const cssTransform = `
    matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})
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
