"use client"

import { clamp } from "lodash"
import {
  Circle,
  Coordinates,
  Mafs,
  Plot,
  Scene,
  Theme,
  useMovablePoint,
} from "mafs"

function Scene1({ sceneSize, sceneSpacing }: any) {
  const c = useMovablePoint([0, 0], {
    constrain: ([x, y]) => [
      clamp(x, -10, 10),
      clamp(y, -10, 10),
    ],
  })

  return (
    <Scene
      x={-sceneSize - sceneSpacing / 2}
      y={-sceneSize / 2}
      width={sceneSize}
      height={sceneSize}
      viewBox={{ x: [-10, 10], y: [-10, 10], padding: 3 }}
      preserveAspectRatio={false}
    >
      <Coordinates.Cartesian
        xAxis={{ lines: 5 }}
        yAxis={{ lines: 5 }}
      />
      <Plot.OfX
        y={(x) => Math.sin(x - c.x) + (x - c.x) / 2 + c.y}
        color={Theme.blue}
      />
      {c.element}
    </Scene>
  )
}

function Scene2({ sceneSize, sceneSpacing }: any) {
  return (
    <Scene
      x={sceneSpacing / 2}
      y={-sceneSize / 2}
      width={sceneSize}
      height={sceneSize}
      viewBox={{
        x: [-10, 10],
        y: [-10, 10],
        padding: 3,
      }}
      preserveAspectRatio={false}
    >
      <Coordinates.Cartesian
        xAxis={{ lines: 5 }}
        yAxis={{ lines: 5 }}
      />
      <Circle center={[0, 0]} radius={5} />
    </Scene>
  )
}

export default function Example() {
  const sceneSize = 250
  const sceneSpacing = 50

  return (
    <Mafs height={300} pan={false}>
      <Scene1
        sceneSize={sceneSize}
        sceneSpacing={sceneSpacing}
      />
      <Scene2
        sceneSize={sceneSize}
        sceneSpacing={sceneSpacing}
      />
    </Mafs>
  )
}
