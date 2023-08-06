"use client"

import * as React from "react"
import {
  Mafs,
  useMovablePoint,
  Plot,
  Polygon,
  Text,
  Coordinates,
} from "mafs"

import sumBy from "lodash/sumBy"
import range from "lodash/range"

interface Partition {
  polygon: [number, number][]
  area: number
}

export default function RiemannSum() {
  const maxNumPartitions = 200

  // Inputs
  const [numPartitions, setNumPartitions] =
    React.useState(40)
  const lift = useMovablePoint([0, -1], {
    constrain: "vertical",
  })
  const a = useMovablePoint([1, 0], {
    constrain: "horizontal",
  })
  const b = useMovablePoint([11, 0], {
    constrain: "horizontal",
  })

  // The function
  const wave = (x: number) =>
    Math.sin(3 * x) + x ** 2 / 20 - 2 + lift.y + 2
  const integral = (x: number) =>
    (1 / 60) * (x ** 3 - 20 * Math.cos(3 * x)) + lift.y * x

  // Outputs
  const exactArea = integral(b.x) - integral(a.x)
  const dx = (b.x - a.x) / numPartitions
  const partitions: Partition[] = range(
    a.x,
    b.x - dx / 2,
    dx,
  ).map((x) => {
    const yMid = wave(x + dx / 2)

    return {
      polygon: [
        [x, 0],
        [x, yMid],
        [x + dx, yMid],
        [x + dx, 0],
      ],
      area: dx * yMid,
    }
  })

  const areaApprox = sumBy(partitions, "area")

  return (
    <>
      <Mafs
        height={400}
        viewBox={{ x: [-1, 12], y: [-3, 10] }}
      >
        <Coordinates.Cartesian subdivisions={2} />

        <Plot.OfX y={wave} color="#358CF1" />

        {partitions.map((partition, index) => (
          <Polygon
            key={index}
            points={partition.polygon}
            fillOpacity={numPartitions / maxNumPartitions}
            color={
              partition.area >= 0
                ? "hsl(112, 100%, 47%)"
                : "hsl(0, 100%, 47%)"
            }
          />
        ))}

        <Text attach="e" x={1.2} y={5.5} size={20}>
          Midpoint Riemann sum:
        </Text>

        <Text attach="e" x={1.2} y={4.5} size={30}>
          {areaApprox.toFixed(4)}
        </Text>

        <Text attach="e" x={1.2} y={3.5} size={20}>
          True area:
        </Text>

        <Text attach="e" x={1.2} y={2.5} size={30}>
          {exactArea.toFixed(4)}
        </Text>

        {lift.element}
        {a.element}
        {b.element}
      </Mafs>

      {/* These classnames are part of the Mafs docs website—they won't work for you. */}
      <div className="p-4 border-gray-700 border-t bg-black text-white">
        Partitions:{" "}
        <input
          type="range"
          min={20}
          max={200}
          value={numPartitions}
          onChange={(event) =>
            setNumPartitions(+event.target.value)
          }
        />
      </div>
    </>
  )
}
