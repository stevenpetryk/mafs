"use client"

// prettier-ignore
import { Mafs, CartesianCoordinates, Transform, useMovablePoint, Theme, Text, Polygon, Circle, vec, } from "mafs"

export default function SimpleTransformExample() {
  const t = useMovablePoint([-2, -2])
  const s = useMovablePoint([4, 4], { color: Theme.blue })
  const r = useMovablePoint([1, 0], {
    color: Theme.green,
    constrain: (p) => vec.normalize(p),
  })

  return (
    <Mafs height={200}>
      <CartesianCoordinates />

      <Transform
        scale={s.point}
        rotate={Math.atan2(r.point[1], r.point[0])}
        translate={t.point}
      >
        <HelloBox />
      </Transform>

      <Transform
        rotate={Math.atan2(r.point[1], r.point[0])}
        translate={t.point}
      >
        {s.element}
      </Transform>
      {t.element}
      <Transform translate={t.point}>{r.element}</Transform>
    </Mafs>
  )
}

function HelloBox() {
  return (
    <>
      {/* prettier-ignore */}
      <Polygon points={[[0, 0], [1, 0], [1, 1], [0, 1]]} />
      <Circle center={[0.5, 0.5]} radius={0.5} />
      <Text x={0.5} y={0.5} transformBehavior="all">
        Hello world!
      </Text>
    </>
  )
}
