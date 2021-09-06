import React from "react"
import * as vec from "vec-la"
import { useScaleContext } from "view/ScaleContext"

/** @public */
export type CardinalDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw"

/** @public */
export interface TextProps {
  x: number
  y: number
  attach?: CardinalDirection
  attachDistance?: number
  size?: number
  color?: string
  svgTextProps?: React.SVGAttributes<SVGTextElement>
}

const Text: React.FC<TextProps> = ({
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
  let alignmentBaseline: React.SVGProps<SVGTextElement>["alignmentBaseline"] = "middle"
  if (attach.includes("n")) {
    alignmentBaseline = "baseline"
    yOffset = 1
  } else if (attach.includes("s")) {
    alignmentBaseline = "hanging"
    yOffset = -1
  }

  const [pixelX, pixelY] = vec.scale(vec.norm([xOffset, yOffset]), attachDistance)

  return (
    <text
      x={scaleX(x) + pixelX}
      y={scaleY(y) - pixelY}
      fontSize={size}
      alignmentBaseline={alignmentBaseline}
      textAnchor={textAnchor}
      style={{
        stroke: color || "var(--mafs-bg)",
        fill: color || "var(--mafs-fg)",
      }}
      className="shadow"
      {...svgTextProps}
    >
      {children}
    </text>
  )
}

export default Text
