import * as React from "react"
import { useScaleContext } from "../view/ScaleContext"
import * as vec from "../vec"
import { useTransformContext } from "./Transform"

export type CardinalDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw"

export interface TextProps {
  x: number
  y: number
  attach?: CardinalDirection
  attachDistance?: number
  size?: number
  color?: string
  transformBehavior?: "all" | "anchor-only"
  svgTextProps?: React.SVGAttributes<SVGTextElement>
}

export const Text: React.FC<TextProps> = ({
  children,
  x,
  y,
  color,
  size = 30,
  svgTextProps = {},
  attach,
  attachDistance = 0,
  transformBehavior = "anchor-only",
}) => {
  const { pixelMatrix } = useScaleContext()
  const transformContext = useTransformContext()

  let xOffset = 0
  let textAnchor: React.SVGProps<SVGTextElement>["textAnchor"] = "middle"
  if (attach?.includes("w")) {
    textAnchor = "end"
    xOffset = -1
  } else if (attach?.includes("e")) {
    textAnchor = "start"
    xOffset = 1
  }

  let yOffset = 0
  let dominantBaseline: React.SVGProps<SVGTextElement>["dominantBaseline"] = "middle"
  if (attach?.includes("n")) {
    dominantBaseline = "baseline"
    yOffset = 1
  } else if (attach?.includes("s")) {
    dominantBaseline = "hanging"
    yOffset = -1
  }

  let [pixelX, pixelY] = [0, 0]
  if (xOffset !== 0 || yOffset !== 0) {
    ;[pixelX, pixelY] = vec.withMag([xOffset, yOffset], attachDistance)
  }

  const center = vec.transform([x, y], vec.matrixMult(pixelMatrix, transformContext))

  return (
    <text
      x={center[0] + pixelX}
      y={center[1] + pixelY}
      fontSize={size}
      dominantBaseline={dominantBaseline}
      textAnchor={textAnchor}
      style={{
        stroke: color || "var(--mafs-bg)",
        fill: color || "var(--mafs-fg)",
        vectorEffect: "non-scaling-stroke",
      }}
      className="mafs-shadow"
      {...svgTextProps}
    >
      {children}
    </text>
  )
}

export default Text
