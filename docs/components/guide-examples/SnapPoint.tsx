"use client"

// prettier-ignore
import { Mafs, Transform, Vector, Coordinates, useMovablePoint, Circle, Polygon, vec, Theme } from "mafs"
import clamp from "lodash/clamp"

export default function SnapPoint() {
  return (
    <Mafs height={200} viewBox={{ x: [-8, 8], y: [-2, 2] }}>
      <Coordinates.Cartesian
        xAxis={{ labels: false, axis: false }}
      />

      <Transform translate={[-3, 0]}>
        <Grid />
      </Transform>

      <Transform translate={[3, 0]}>
        <Radial />
      </Transform>
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
        color={Theme.blue}
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
        color={Theme.blue}
        fillOpacity={0}
      />
      <Vector tail={[0, 0]} tip={radialMotion.point} />
      {radialMotion.element}
    </>
  )
}
