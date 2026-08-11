import { Coordinates, Mafs, Plot, Theme, vec } from "mafs"

const flow = ([x, y]: vec.Vector2): vec.Vector2 => [-y, x]

const opacity = ([x, y]: vec.Vector2) => Math.max(0.15, 1 - vec.mag([x, y]) / 5)

export function PolarVectorDemo() {
  return (
    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan zoom>
      <Coordinates.Polar lines={1} subdivisions={4} />
      <Plot.VectorField
        xy={flow}
        xyOpacity={opacity}
        opacityStep={0.1}
        step={0.5}
        color={Theme.violet}
      />
    </Mafs>
  )
}
