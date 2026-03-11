import { useTransformContext } from "../context/TransformContext"
import { Theme } from "./Theme"
import { vec } from "../vec"

/** Visual style for the annotation */
export type AnnotationStyle = "callout" | "badge" | "minimal"

/** Props for the Annotation component */
export interface AnnotationProps {
  /** Position in math-space coordinates */
  position: vec.Vector2
  /** Text label to display */
  label: string
  /** Optional arrow pointing to a target */
  arrow?: { from: vec.Vector2; to: vec.Vector2 }
  /** Visual style (default: "minimal") */
  style?: AnnotationStyle
  /** Color (default: Theme.foreground) */
  color?: string
}

/**
 * A label/annotation component positioned in math-space.
 * Supports callout boxes, badges, and minimal text styles,
 * with optional arrows pointing to targets.
 *
 * Renders inside the SVG canvas using the Mafs transform pipeline.
 */
export function Annotation({
  position,
  label,
  arrow,
  style = "minimal",
  color = Theme.foreground,
}: AnnotationProps) {
  const { viewTransform, userTransform } = useTransformContext()
  const combinedTransform = vec.matrixMult(viewTransform, userTransform)

  const [px, py] = vec.transform(position, combinedTransform)

  const arrowFrom = arrow ? vec.transform(arrow.from, combinedTransform) : null
  const arrowTo = arrow ? vec.transform(arrow.to, combinedTransform) : null

  return (
    <g className="mafs-annotation">
      {/* Arrow line */}
      {arrowFrom && arrowTo && (
        <line
          x1={arrowFrom[0]}
          y1={arrowFrom[1]}
          x2={arrowTo[0]}
          y2={arrowTo[1]}
          stroke={color}
          strokeWidth={1.5}
          markerEnd="url(#mafs-annotation-arrowhead)"
          opacity={0.8}
        />
      )}

      {/* Arrowhead marker definition */}
      {arrow && (
        <defs>
          <marker
            id="mafs-annotation-arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill={color} />
          </marker>
        </defs>
      )}

      {/* Callout style: rounded rect with text */}
      {style === "callout" && (
        <>
          <rect
            x={px - 4}
            y={py - 16}
            rx={4}
            ry={4}
            width={label.length * 8 + 8}
            height={22}
            fill={Theme.background}
            stroke={color}
            strokeWidth={1.5}
            opacity={0.95}
          />
          <text
            x={px + label.length * 4}
            y={py - 2}
            textAnchor="middle"
            fontSize={14}
            fill={color}
            style={{ pointerEvents: "none" }}
          >
            {label}
          </text>
        </>
      )}

      {/* Badge style: small circle with text */}
      {style === "badge" && (
        <>
          <circle
            cx={px}
            cy={py}
            r={Math.max(12, label.length * 4 + 4)}
            fill={color}
            opacity={0.15}
          />
          <circle
            cx={px}
            cy={py}
            r={Math.max(12, label.length * 4 + 4)}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
          />
          <text
            x={px}
            y={py + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill={color}
            fontWeight="bold"
            style={{ pointerEvents: "none" }}
          >
            {label}
          </text>
        </>
      )}

      {/* Minimal style: just text with shadow */}
      {style === "minimal" && (
        <text
          x={px}
          y={py}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={16}
          fill={color}
          className="mafs-shadow"
          style={{ pointerEvents: "none" }}
        >
          {label}
        </text>
      )}
    </g>
  )
}

Annotation.displayName = "Annotation"
