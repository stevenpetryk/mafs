"use client"

import {
  Coordinates,
  Debug,
  Mafs,
  useTransformContext,
  vec,
} from "mafs"

export default function Example() {
  return (
    <Mafs height={300} viewBox={{ y: [-1, 5], x: [-1, 6] }}>
      <Coordinates.Cartesian />

      <Debug.TransformWidget>
        <PointCloud />
      </Debug.TransformWidget>
    </Mafs>
  )
}

function PointCloud() {
  const { userTransform, viewTransform } =
    useTransformContext()

  const size = 5
  const perAxis = 10

  const points: { at: vec.Vector2; color: string }[] = []
  for (let i = 0; i <= size; i += size / perAxis) {
    for (let j = 0; j <= size; j += size / perAxis) {
      // prettier-ignore
      const userTransformedPoint = vec.transform([i, j], userTransform)
      // prettier-ignore
      const viewTransformedPoint = vec.transform(userTransformedPoint, viewTransform)

      const h = (360 * (i + j)) / (size * 2)
      const s = 100

      // If h is blueish, make the point lighter
      const l = h > 200 && h < 300 ? 70 : 50

      points.push({
        at: viewTransformedPoint,
        color: `hsl(${h} ${s}% ${l}%)`,
      })
    }
  }

  return (
    <>
      {points.map(({ at: [x, y], color }) => {
        return (
          <circle
            key={`${x},${y}`}
            cx={x}
            cy={y}
            r={3}
            fill={color}
            className="mafs-shadow"
          />
        )
      })}
    </>
  )
}
