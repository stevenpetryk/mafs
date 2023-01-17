import * as React from "react"
import { vec } from "../vec"
import { useTransformContext } from "../context/TransformContext"

export type CardinalDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw"

export type TextProps = React.PropsWithChildren<{
  x: number
  y: number
  attach?: CardinalDirection
  attachDistance?: number
  size?: number
  color?: string
  svgTextProps?: React.SVGAttributes<SVGTextElement>
}>

export function Text({
  children,
  x,
  y,
  color,
  size = 30,
  svgTextProps = {},
  attach,
  attachDistance = 0,
}: TextProps) {
  const { viewTransform: pixelMatrix, userTransform: transformContext } = useTransformContext()

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

Text.displayName = "Text"

export default Text
