"use client"

import * as React from "react"
import {
  Mafs,
  Point,
  Coordinates,
  useStopwatch,
} from "mafs"

export default function AnimatedPoint() {
  const { time, start } = useStopwatch()

  // Stopwatches are stopped initially, so we
  // can start it when the component mounts.
  // We declare `start` as a dependency of the
  // effect to make React happy, but Mafs
  // guarantees its identity will never change.
  React.useEffect(() => start(), [start])

  return (
    <Mafs height={500}>
      <Coordinates.Cartesian />
      <Point
        x={Math.cos(time * 2 * Math.PI)}
        y={Math.sin(time * 2 * Math.PI)}
      />
    </Mafs>
  )
}
