"use client"

// prettier-ignore
import { Mafs, Group, Vector, CartesianCoordinates, useMovablePoint, Circle, Polygon, vec } from "mafs"
import clamp from "lodash/clamp"

export default function SnapPoint() {
  return (
    <Mafs
      height={200}
      xAxisExtent={[-8.5, 8.5]}
      yAxisExtent={[-3, 3]}
    >
      <CartesianCoordinates xAxis={{ labels: false }} />

      <Group translate={[-3, 0]}>
        <Grid />
      </Group>

      <Group translate={[3, 0]}>
        <Radial />
      </Group>
    </Mafs>
  )
}

function Grid() {
  const gridMotion = useMovablePoint([1, 1], {
    // Constrain this point to whole numbers inside of a rectangle
    constrain: ([x, y]) => [
      clamp(Math.round(x), -2, 2),
      clamp(Math.round(y), -2, 2),
    ],
  })

  return (
    <>
      <Vector tail={[0, 0]} tip={gridMotion.point} />

      <Polygon
        // prettier-ignore
        points={[[-2, -2], [2, -2], [2, 2], [-2, 2]]}
        fillOpacity={0}
        strokeOpacity={0.5}
        strokeStyle="dashed"
      />
      {gridMotion.element}
    </>
  )
}

function Radial() {
  const radius = 2
  const radialMotion = useMovablePoint([0, radius], {
    // Constrain this point to specific angles from the center
    constrain: (point) => {
      const angle = Math.atan2(point[1], point[0])
      const snap = Math.PI / 16
      const roundedAngle = Math.round(angle / snap) * snap
      return vec.rotate([radius, 0], roundedAngle)
    },
  })

  return (
    <>
      <Circle
        center={[0, 0]}
        radius={radius}
        fillOpacity={0}
        strokeOpacity={0.5}
        strokeStyle="dashed"
      />
      <Vector tail={[0, 0]} tip={radialMotion.point} />
      {radialMotion.element}
    </>
  )
}
