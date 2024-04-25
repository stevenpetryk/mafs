import { Stroked, Theme } from "../../display/Theme"
import { useTransformContext } from "../../context/TransformContext"
import { round } from "../../math"
import { vec } from "../../vec"
import { usePaneContext } from "../../context/PaneContext"

export interface ThroughPointsProps extends Stroked {
  point1: vec.Vector2
  point2: vec.Vector2
}

export function ThroughPoints({
  point1,
  point2,
  color = Theme.foreground,
  style = "solid",
  weight = 2,
  opacity = 1.0,
}: ThroughPointsProps) {
  const { xPaneRange, yPaneRange } = usePaneContext()
  const [xMin, xMax] = xPaneRange
  const [yMin, yMax] = yPaneRange

  const { userTransform } = useTransformContext()

  const tPoint1 = vec.transform(point1, userTransform)
  const tPoint2 = vec.transform(point2, userTransform)

  const slope = (tPoint2[1] - tPoint1[1]) / (tPoint2[0] - tPoint1[0])

  let offscreen1: vec.Vector2
  let offscreen2: vec.Vector2

  if (Math.abs(Math.atan(slope)) > Math.PI / 4) {
    offscreen1 = [(yMin - tPoint1[1]) / slope + tPoint1[0], yMin]
    offscreen2 = [(yMax - tPoint1[1]) / slope + tPoint1[0], yMax]
  } else {
    offscreen1 = [xMin, slope * (xMin - tPoint1[0]) + tPoint1[1]]
    offscreen2 = [xMax, slope * (xMax - tPoint1[0]) + tPoint1[1]]
  }

  return (
    <line
      x1={round(offscreen1[0], 2)}
      y1={round(offscreen1[1], 2)}
      x2={round(offscreen2[0], 2)}
      y2={round(offscreen2[1], 2)}
      style={{
        stroke: color,
        strokeDasharray: style === "dashed" ? "var(--mafs-line-stroke-dash-style)" : undefined,
        transform: "var(--mafs-view-transform)",
        vectorEffect: "non-scaling-stroke",
      }}
      strokeWidth={weight}
      opacity={opacity}
    />
  )
}

ThroughPoints.displayName = "Line.ThroughPoints"
