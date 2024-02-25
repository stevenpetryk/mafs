"use client"

import * as React from "react"
import {
  Mafs,
  useStopwatch,
  Point,
  useMovablePoint,
  Plot,
  Vector,
  Polygon,
} from "mafs"

export default function ProjectileMotion() {
  const xSpan = 1.75
  const ySpan = 1.75
  const initialVelocity = useMovablePoint([0.5, 1.5])

  const vectorScale = 4

  const g = 9.8
  const xVelocity = initialVelocity.x * vectorScale
  const yVelocity = initialVelocity.y * vectorScale
  const velocityAngle = Math.atan(yVelocity / xVelocity)
  const velocityMag = Math.sqrt(
    xVelocity ** 2 + yVelocity ** 2,
  )
  const timeOfFlight =
    Math.abs(2 * velocityMag * Math.sin(velocityAngle)) / g

  function positionAtTime(t: number): [number, number] {
    return [xVelocity * t, yVelocity * t - 0.5 * g * t ** 2]
  }
  const [restingX, restingY] = positionAtTime(timeOfFlight)

  const {
    time: t,
    start,
    stop,
  } = useStopwatch({
    endTime: timeOfFlight,
  })

  React.useEffect(() => {
    stop()
    // Reset the ball's whenever the resting position changes
  }, [restingX, restingY, stop])

  return (
    <>
      <Mafs
        viewBox={{
          x: [1 - xSpan, 1 + xSpan],
          y: [1 - ySpan, 1 + ySpan],
        }}
      >
        <Polygon
          points={[
            [-100, 0],
            [100, 0],
            [100, -100],
            [-100, -100],
          ]}
          color="green"
        />

        <Vector
          tip={[
            xVelocity / vectorScale,
            yVelocity / vectorScale,
          ]}
        />

        {yVelocity > 0 && (
          <>
            <Plot.Parametric
              xy={positionAtTime}
              t={[0, timeOfFlight]}
              opacity={0.4}
              style="dashed"
            />
            <Point
              x={restingX}
              y={restingY}
              opacity={0.5}
            />
          </>
        )}

        <Point
          x={positionAtTime(t)[0]}
          y={positionAtTime(t)[1]}
        />
        <text
          x={10}
          y={30}
          fontSize={20}
          className="transform-to-center"
          fill="white"
        >
          t = {t.toFixed(2)}/
          {yVelocity > 0 ? timeOfFlight.toFixed(2) : "—"}{" "}
          seconds
        </text>

        {initialVelocity.element}
      </Mafs>

      {/* These classnames are part of the Mafs docs website—they won't work for you. */}
      <div className="p-4 bg-black border-t border-gray-900 space-x-4">
        <button
          className="bg-gray-200 text-black font-bold px-4 py-1 rounded-sm"
          onClick={start}
          disabled={yVelocity <= 0}
        >
          Start
        </button>
        <button
          className="bg-gray-200 text-black font-bold px-4 py-1 rounded-sm"
          onClick={stop}
        >
          Reset
        </button>
      </div>
    </>
  )
}
