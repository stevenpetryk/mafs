import * as React from "react"
import { useViewportTransformContext } from "../context/ViewTransformContext"
import { useTransformContext } from "./Transform"
import { Theme } from "./Theme"
import * as vec from "../vec"

export interface PointProps {
  x: number
  y: number
  color?: string
  opacity?: number
  svgCircleProps?: React.SVGProps<SVGCircleElement>
}

export const Point: React.VFC<PointProps> = ({
  x,
  y,
  color = Theme.foreground,
  opacity = 1,
  svgCircleProps = {},
}) => {
  const { toPx: pixelMatrix } = useViewportTransformContext()
  const transform = useTransformContext()

  const [cx, cy] = vec.transform([x, y], vec.matrixMult(pixelMatrix, transform))

  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      {...svgCircleProps}
      style={{ fill: color, opacity, ...svgCircleProps.style }}
    />
  )
}
