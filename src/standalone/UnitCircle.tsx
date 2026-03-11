import * as React from "react"
import { Mafs } from "../view/Mafs"
import { Circle } from "../display/Circle"
import { Point } from "../display/Point"
import { Text } from "../display/Text"
import { Theme } from "../display/Theme"
import { Coordinates } from "../display/Coordinates"
import { vec } from "../vec"
import { Line } from "../display/Line"
import { useMovablePoint } from "../interaction/useMovablePoint"

/** Label mode for angle display */
export type UnitCircleLabelMode = "radians" | "degrees" | "both"

/** Props for the UnitCircle component */
export interface UnitCircleProps {
  /** Current angle in radians (controlled) */
  angle?: number
  /** Whether to show the sin line (default: true) */
  showSin?: boolean
  /** Whether to show the cos line (default: true) */
  showCos?: boolean
  /** Whether to show the tan line (default: false) */
  showTan?: boolean
  /** Whether to show the arc (default: true) */
  showArc?: boolean
  /** Whether the point is draggable (default: true) */
  draggable?: boolean
  /** Angle label display mode (default: "radians") */
  labelMode?: UnitCircleLabelMode
  /** Whether to show special angle markers (default: false) */
  specialAngles?: boolean
  /** Called when angle changes via drag */
  onAngleChange?: (angle: number) => void
  /** Width in pixels (default: 400) */
  width?: number
  /** Height in pixels (default: 400) */
  height?: number
}

const SPECIAL_ANGLES = [
  0,
  Math.PI / 6,
  Math.PI / 4,
  Math.PI / 3,
  Math.PI / 2,
  (2 * Math.PI) / 3,
  (3 * Math.PI) / 4,
  (5 * Math.PI) / 6,
  Math.PI,
  (7 * Math.PI) / 6,
  (5 * Math.PI) / 4,
  (4 * Math.PI) / 3,
  (3 * Math.PI) / 2,
  (5 * Math.PI) / 3,
  (7 * Math.PI) / 4,
  (11 * Math.PI) / 6,
]

function formatAngle(radians: number, mode: UnitCircleLabelMode): string {
  const degrees = ((radians * 180) / Math.PI).toFixed(1)
  const piMultiple = radians / Math.PI
  const piStr = Math.abs(piMultiple) < 0.01 ? "0" : `${piMultiple.toFixed(2)}π`

  if (mode === "degrees") return `${degrees}°`
  if (mode === "radians") return piStr
  return `${piStr} (${degrees}°)`
}

function UnitCircleInner({
  angle: controlledAngle,
  showSin = true,
  showCos = true,
  showTan = false,
  showArc = true,
  draggable = true,
  labelMode = "radians",
  specialAngles = false,
  onAngleChange,
}: Omit<UnitCircleProps, "width" | "height">) {
  const movablePoint = useMovablePoint(
    [Math.cos(controlledAngle ?? Math.PI / 4), Math.sin(controlledAngle ?? Math.PI / 4)],
    {
      constrain: (point: vec.Vector2) => vec.withMag(point, 1),
      color: Theme.blue,
    },
  )

  const px = movablePoint.point[0]
  const py = movablePoint.point[1]
  const currentAngle = Math.atan2(py, px)
  const normalizedAngle = currentAngle < 0 ? currentAngle + 2 * Math.PI : currentAngle

  React.useEffect(() => {
    onAngleChange?.(normalizedAngle)
  }, [normalizedAngle, onAngleChange])

  // Generate arc path
  const arcPoints = React.useMemo(() => {
    const steps = Math.max(20, Math.abs(normalizedAngle) * 10)
    const points: vec.Vector2[] = []
    const arcRadius = 0.3
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * normalizedAngle
      points.push([Math.cos(t) * arcRadius, Math.sin(t) * arcRadius])
    }
    return points
  }, [normalizedAngle])

  return (
    <>
      <Coordinates.Cartesian />

      {/* Unit circle */}
      <Circle center={[0, 0]} radius={1} color={Theme.foreground} weight={1.5} fillOpacity={0} strokeOpacity={0.3} />

      {/* Special angle markers */}
      {specialAngles &&
        SPECIAL_ANGLES.map((a) => (
          <Point
            key={a}
            x={Math.cos(a)}
            y={Math.sin(a)}
            color={Theme.foreground}
            opacity={0.3}
            svgCircleProps={{ r: 3 } as React.SVGProps<SVGCircleElement>}
          />
        ))}

      {/* Radius line */}
      <Line.Segment
        point1={[0, 0]}
        point2={[px, py]}
        color={Theme.blue}
        weight={2}
      />

      {/* Cos line (horizontal projection) */}
      {showCos && (
        <>
          <Line.Segment
            point1={[0, 0]}
            point2={[px, 0]}
            color={Theme.red}
            weight={3}
          />
          <Text x={px / 2} y={-0.12} size={14} color={Theme.red} attach="s">
            cos
          </Text>
        </>
      )}

      {/* Sin line (vertical projection) */}
      {showSin && (
        <>
          <Line.Segment
            point1={[px, 0]}
            point2={[px, py]}
            color={Theme.green}
            weight={3}
          />
          <Text x={px + 0.12} y={py / 2} size={14} color={Theme.green} attach="e">
            sin
          </Text>
        </>
      )}

      {/* Tan line */}
      {showTan && Math.abs(px) > 0.01 && (
        <>
          <Line.Segment
            point1={[1, 0]}
            point2={[1, py / px]}
            color={Theme.orange}
            weight={3}
          />
          <Text x={1.15} y={(py / px) / 2} size={14} color={Theme.orange} attach="e">
            tan
          </Text>
        </>
      )}

      {/* Arc */}
      {showArc && arcPoints.length > 1 && (
        <g>
          <polyline
            points={arcPoints.map(([ax, ay]) => `${ax},${ay}`).join(" ")}
            fill="none"
            stroke={Theme.indigo}
            strokeWidth={2}
            opacity={0.7}
            style={{
              transform: "var(--mafs-view-transform)",
              vectorEffect: "non-scaling-stroke",
            }}
          />
        </g>
      )}

      {/* Angle label */}
      <Text x={0.45} y={0.2} size={12} color={Theme.indigo}>
        {formatAngle(normalizedAngle, labelMode)}
      </Text>

      {/* Draggable point on circumference */}
      {draggable && movablePoint.element}
      {!draggable && <Point x={px} y={py} color={Theme.blue} />}

      {/* Value readouts */}
      <Text x={-1.4} y={-1.3} size={13} color={Theme.red} attach="w">
        {`cos(θ) = ${px.toFixed(3)}`}
      </Text>
      <Text x={-1.4} y={-1.5} size={13} color={Theme.green} attach="w">
        {`sin(θ) = ${py.toFixed(3)}`}
      </Text>
      {showTan && (
        <Text x={-1.4} y={-1.7} size={13} color={Theme.orange} attach="w">
          {`tan(θ) = ${Math.abs(px) > 0.01 ? (py / px).toFixed(3) : "undefined"}`}
        </Text>
      )}
    </>
  )
}

/**
 * An interactive unit circle visualization.
 * Shows a draggable point on the circumference with sin, cos, and tan lines.
 * Wraps a Mafs canvas internally.
 */
export function UnitCircle({
  width = 400,
  height = 400,
  ...props
}: UnitCircleProps) {
  return (
    <Mafs
      width={width}
      height={height}
      viewBox={{ x: [-1.7, 1.7], y: [-1.7, 1.7] }}
      preserveAspectRatio="contain"
    >
      <UnitCircleInner {...props} />
    </Mafs>
  )
}

UnitCircle.displayName = "UnitCircle"
