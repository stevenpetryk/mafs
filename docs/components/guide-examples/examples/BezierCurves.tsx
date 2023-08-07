"use client"

import * as React from "react"
import {
  Coordinates,
  Plot,
  Line,
  Mafs,
  Point,
  Theme,
  useMovablePoint,
  useStopwatch,
  vec,
} from "mafs"
import { easeInOutCubic } from "js-easing-functions"

/**
 * Given the four control points, calculate
 * the xy position of the bezier curve at value t.
 * See https://youtu.be/aVwxzDHniEw?t=265
 */
function xyFromBernsteinPolynomial(
  p1: vec.Vector2,
  c1: vec.Vector2,
  c2: vec.Vector2,
  p2: vec.Vector2,
  t: number,
) {
  return [
    vec.scale(p1, -(t ** 3) + 3 * t ** 2 - 3 * t + 1),
    vec.scale(c1, 3 * t ** 3 - 6 * t ** 2 + 3 * t),
    vec.scale(c2, -3 * t ** 3 + 3 * t ** 2),
    vec.scale(p2, t ** 3),
  ].reduce(vec.add, [0, 0])
}

function inPairs<T>(arr: T[]) {
  const pairs: [T, T][] = []
  for (let i = 0; i < arr.length - 1; i++) {
    pairs.push([arr[i], arr[i + 1]])
  }

  return pairs
}

export default function BezierCurves() {
  const [t, setT] = React.useState(0.5)
  const opacity = 1 - (2 * t - 1) ** 6

  const p1 = useMovablePoint([-5, 2])
  const p2 = useMovablePoint([5, -2])

  const c1 = useMovablePoint([-2, -3])
  const c2 = useMovablePoint([2, 3])

  const lerp1 = vec.lerp(p1.point, c1.point, t)
  const lerp2 = vec.lerp(c1.point, c2.point, t)
  const lerp3 = vec.lerp(c2.point, p2.point, t)

  const lerp12 = vec.lerp(lerp1, lerp2, t)
  const lerp23 = vec.lerp(lerp2, lerp3, t)

  const lerpBezier = vec.lerp(lerp12, lerp23, t)

  const duration = 2
  const { time, start } = useStopwatch({
    endTime: duration,
  })
  React.useEffect(() => {
    setTimeout(() => start(), 500)
  }, [start])
  React.useEffect(() => {
    setT(easeInOutCubic(time, 0, 0.75, duration))
  }, [time])

  function drawLineSegments(
    pointPath: vec.Vector2[],
    color: string,
    customOpacity = opacity * 0.5,
  ) {
    return inPairs(pointPath).map(([p1, p2], index) => (
      <Line.Segment
        key={index}
        point1={p1}
        point2={p2}
        opacity={customOpacity}
        color={color}
      />
    ))
  }

  function drawPoints(
    points: vec.Vector2[],
    color: string,
  ) {
    return points.map((point, index) => (
      <Point
        key={index}
        x={point[0]}
        y={point[1]}
        color={color}
        opacity={opacity}
      />
    ))
  }

  return (
    <>
      <Mafs viewBox={{ x: [-5, 5], y: [-4, 4] }}>
        <Coordinates.Cartesian
          xAxis={{ labels: false, axis: false }}
          yAxis={{ labels: false, axis: false }}
        />

        {/* Control lines */}
        {drawLineSegments(
          [p1.point, c1.point, c2.point, p2.point],
          Theme.pink,
          0.5,
        )}

        {/* First-order lerps */}
        {drawLineSegments([lerp1, lerp2, lerp3], Theme.red)}
        {drawPoints([lerp1, lerp2, lerp3], Theme.red)}

        {/* Second-order lerps */}
        {drawLineSegments([lerp12, lerp23], Theme.yellow)}
        {drawPoints([lerp12, lerp23], Theme.yellow)}

        {/* Quadratic bezier lerp  */}
        <Plot.Parametric
          t={[0, t]}
          weight={3}
          xy={(t) =>
            xyFromBernsteinPolynomial(
              p1.point,
              c1.point,
              c2.point,
              p2.point,
              t,
            )
          }
        />
        {/* Show remaining bezier with dashed line  */}
        <Plot.Parametric
          // Iterate backwards so that dashes don't move
          t={[1, t]}
          weight={3}
          opacity={0.5}
          style="dashed"
          xy={(t) =>
            xyFromBernsteinPolynomial(
              p1.point,
              c1.point,
              c2.point,
              p2.point,
              t,
            )
          }
        />

        {drawPoints([lerpBezier], Theme.foreground)}

        {p1.element}
        {p2.element}
        {c1.element}
        {c2.element}
      </Mafs>

      {/* These classnames are part of the Mafs docs website—they won't work for you. */}
      <div className="p-4 border-gray-700 border-t bg-black text-white">
        <span className="font-display">t =</span>{" "}
        <input
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={t}
          onChange={(event) => setT(+event.target.value)}
        />
      </div>
    </>
  )
}
