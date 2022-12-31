"use client"

// prettier-ignore
import { Mafs, FunctionGraph, Point, CartesianCoordinates, useMovablePoint, Group } from "mafs"
import range from "lodash/range"
import * as React from "react"

export default function PointsAlongFunction() {
  const [angle, setAngle] = React.useState(0)
  const angleRadians = angle * (Math.PI / 180)

  const fn = (x: number) => Math.sin(x / 2) ** 2
  const sep = useMovablePoint([1, 0], {
    constrain: "horizontal",
  })

  const points =
    sep.x != 0
      ? range(0, 10 * sep.x, sep.x).concat(
          range(0, -10 * sep.x, -sep.x)
        )
      : []

  return (
    <>
      <Mafs height={500} yAxisExtent={[-1.3, 4.7]}>
        <CartesianCoordinates />

        <Group rotate={angleRadians} translate={[1, 0]}>
          <FunctionGraph.OfX y={fn} opacity={0.25} />
        </Group>
        {points.map((x, index) => (
          <Point x={x} y={fn(x)} key={index} />
        ))}
        {sep.element}
      </Mafs>
      <input
        type="range"
        min={0}
        max={180}
        value={angle}
        onChange={(e) => setAngle(+e.target.value)}
      />
    </>
  )
}
