import * as React from "react"
import { Stroked } from "../display/Theme"
import { Theme } from "./Theme"
import { vec } from "../vec"
import { useTransformContext } from "../context/TransformContext"

// This is sort of a hack—every SVG pattern on a page needs a unique ID, otherwise they conflict.
let incrementer = 0

export interface VectorProps extends Stroked {
  tail?: vec.Vector2
  tip: vec.Vector2
  svgLineProps?: React.SVGProps<SVGLineElement>
}

export function Vector({
  tail = [0, 0],
  tip,
  color = Theme.foreground,
  weight = 2,
  style = "solid",
  opacity = 1.0,
  svgLineProps = {},
}: VectorProps) {
  const { userTransform, viewTransform } = useTransformContext()
  const combinedTransform = vec.matrixMult(viewTransform, userTransform)

  const pixelTail = vec.transform(tail, combinedTransform)
  const pixelTip = vec.transform(tip, combinedTransform)

  const id = React.useMemo(() => `mafs-triangle-${incrementer++}`, [])

  return (
    <>
      <defs>
        <marker id={id} markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" fill={color || "var(--mafs-fg)"} strokeWidth={0} />
        </marker>
      </defs>
      <line
        x1={pixelTail[0]}
        y1={pixelTail[1]}
        x2={pixelTip[0]}
        y2={pixelTip[1]}
        strokeWidth={weight}
        markerEnd={`url(#${id})`}
        {...svgLineProps}
        style={{
          stroke: color || "var(--mafs-fg)",
          strokeDasharray: style === "dashed" ? "var(--mafs-line-stroke-dash-style)" : undefined,
          fill: color,
          strokeOpacity: opacity,
          ...(svgLineProps?.style || {}),
          vectorEffect: "non-scaling-stroke",
        }}
      />
    </>
  )
}

Vector.displayName = "Vector"
