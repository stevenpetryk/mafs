"use client"

// prettier-ignore
import { Mafs, Coordinates, Transform, useMovablePoint, Theme, Text, Polygon, Circle, vec, } from "mafs"

export default function SimpleTransformExample() {
  const t = useMovablePoint([-4, -2])
  const s = useMovablePoint([8, 4], { color: Theme.blue })
  const r = useMovablePoint([1, 0], {
    color: Theme.green,
    constrain: (p) => vec.normalize(p),
  })
  const angle = Math.atan2(r.point[1], r.point[0])

  return (
    <Mafs height={400} viewBox={{ x: [-8, 8], y: [-3, 3] }}>
      <Coordinates.Cartesian />

      <Transform translate={t.point}>
        <Transform rotate={angle}>
          <Transform scale={s.point}>
            <HelloBox />
          </Transform>

          {s.element}
        </Transform>

        {r.element}
      </Transform>

      {t.element}
    </Mafs>
  )
}

function HelloBox() {
  return (
    <>
      {/* prettier-ignore */}
      <Polygon points={[[0, 0], [1, 0], [1, 1], [0, 1]]} />
      <Circle center={[0.5, 0.5]} radius={0.5} />
      <Text x={0.5} y={0.5}>
        Hello world!
      </Text>
    </>
  )
}
