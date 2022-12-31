"use client"

import * as React from "react"
import {
  Mafs,
  Theme,
  Polygon,
  CartesianCoordinates,
  useMovablePoint,
  Vector,
} from "mafs"

export default function SimplePoint() {
  const velocity = useMovablePoint([3, 3])

  return (
    <Mafs xAxisExtent={[-1, 10]} yAxisExtent={[-0.5, 5]}>
      <CartesianCoordinates />
      <Polygon
        color={Theme.green}
        fillOpacity={0.9}
        points={[
          [-1000, 0],
          [1000, 0],
          [1000, -1000],
          [-1000, -1000],
        ]}
      />
      <Vector tip={velocity.point} style="dashed" />
      {velocity.element}
    </Mafs>
  )
}
