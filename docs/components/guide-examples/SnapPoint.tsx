"use client"

// prettier-ignore
import { Mafs, Vector, CartesianCoordinates, useMovablePoint, Circle, Polygon } from "mafs"
import * as vec from "vec-la"
import clamp from "lodash/clamp"

export default function SnapPoint() {
  const gridMotion = useMovablePoint([-2, 1], {
    // Constrain this point to whole numbers inside of a rectangle
    constrain: ([x, y]) => [
      clamp(Math.round(x), -5, -1),
      clamp(Math.round(y), -2, 2),
    ],
  })

  const radius = 2
  const shift = vec.matrixBuilder().translate(3, 0).get()
  const radialMotion = useMovablePoint([0, radius], {
    // Constrain this point to specific angles from the center
    constrain: (point) => {
      const angle = Math.PI / 2 - Math.atan2(...point)
      const snap = Math.PI / 16
      const roundedAngle = Math.round(angle / snap) * snap
      return vec.rotate([radius, 0], roundedAngle)
    },
    // (More on transforms in the next section)
    transform: shift,
  })

  return (
    <Mafs
      height={200}
      xAxisExtent={[-8.5, 8.5]}
      yAxisExtent={[-3, 3]}
    >
      <CartesianCoordinates xAxis={{ labels: false }} />

      <Vector tail={[-3, 0]} tip={gridMotion.point} />

      <Polygon
        // prettier-ignore
        points={[[-5, -2], [-1, -2], [-1, 2], [-5, 2]]}
        fillOpacity={0}
        strokeOpacity={0.5}
        strokeStyle="dashed"
      />
      <Circle
        center={vec.transform([0, 0], shift)}
        radius={radius}
        fillOpacity={0}
        strokeOpacity={0.5}
        strokeStyle="dashed"
      />
      <Vector
        tail={vec.transform([0, 0], shift)}
        tip={vec.transform(radialMotion.point, shift)}
      />

      {gridMotion.element}
      {radialMotion.element}
    </Mafs>
  )
}
