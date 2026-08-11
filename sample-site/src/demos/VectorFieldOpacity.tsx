import { Mafs, Coordinates, Plot, vec } from "mafs"

// A swirling flow field: each point rotates around the origin.
const swirl = ([x, y]: vec.Vector2): vec.Vector2 => {
  const r = Math.sqrt(x * x + y * y)
  const speed = Math.min(1, r / 3)
  return [-y * speed, x * speed]
}

// Fade arrows out as they move away from the center.
const falloff = ([x, y]: vec.Vector2): number => Math.max(0, 1 - Math.sqrt(x * x + y * y) / 5)

export function VectorFieldOpacity() {
  return (
    <Mafs viewBox={{ x: [-5.5, 5.5], y: [-4, 4] }}>
      <Plot.VectorField
        xy={swirl}
        xyOpacity={falloff}
        step={0.45}
        opacityStep={0.1}
        color="var(--mafs-blue)"
      />
      <Coordinates.Cartesian
        xAxis={{ lines: 1, axis: false, labels: false }}
        yAxis={{ lines: 1, axis: false, labels: false }}
      />
    </Mafs>
  )
}
