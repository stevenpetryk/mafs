import * as React from "react"
import { useScaleContext } from "../view/ScaleContext"
import * as vec from "../vec"

export type CardinalDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw"

export interface TextProps {
  x: number
  y: number
  attach?: CardinalDirection
  attachDistance?: number
  size?: number
  color?: string
  svgTextProps?: React.SVGAttributes<SVGTextElement>
}

export const Text: React.FC<TextProps> = ({
  children,
  x,
  y,
  color,
  size = 30,
  svgTextProps = {},
  attach = "e",
  attachDistance = 0,
}) => {
  const { scaleX, scaleY } = useScaleContext()

  let xOffset = 0
  let textAnchor: React.SVGProps<SVGTextElement>["textAnchor"] = "middle"
  if (attach.includes("w")) {
    textAnchor = "end"
    xOffset = -1
  } else if (attach.includes("e")) {
    textAnchor = "start"
    xOffset = 1
  }

  let yOffset = 0
  let dominantBaseline: React.SVGProps<SVGTextElement>["dominantBaseline"] = "middle"
  if (attach.includes("n")) {
    dominantBaseline = "baseline"
    yOffset = 1
  } else if (attach.includes("s")) {
    dominantBaseline = "hanging"
    yOffset = -1
  }

  const [pixelX, pixelY] = vec.scale(vec.normalize([xOffset, yOffset]), attachDistance)

  return (
    <text
      x={scaleX(x) + pixelX}
      y={scaleY(y) - pixelY}
      fontSize={size}
      dominantBaseline={dominantBaseline}
      textAnchor={textAnchor}
      style={{
        stroke: color || "var(--mafs-bg)",
        fill: color || "var(--mafs-fg)",
      }}
      className="mafs-shadow"
      {...svgTextProps}
    >
      {children}
    </text>
  )
}

export default Text
