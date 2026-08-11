import * as React from "react"
import { Stroked } from "../display/Theme"
import { Theme } from "./Theme"
import { vec } from "../vec"
import { useTransformContext } from "../context/TransformContext"

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

  // React's id is stable across server rendering and hydration. Colons are
  // valid in HTML ids, but removing them also keeps SVG url fragments easy to
  // inspect and compatible with older SVG implementations.
  const id = `mafs-triangle-${React.useId().replace(/:/g, "")}`

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
