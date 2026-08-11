import { Mafs, Coordinates, Plot, vec } from "mafs"

// All integer multiples of π/2 strictly inside the visible domain — these are
// the vertical asymptotes of tan(x). Returning exclusions from a function makes
// them follow the camera as it pans and zooms.
function tanExclusions([min, max]: vec.Vector2): number[] {
  const exclusions: number[] = []
  const start = Math.ceil(min / (Math.PI / 2))
  const end = Math.floor(max / (Math.PI / 2))
  for (let k = start; k <= end; k++) {
    exclusions.push(k * (Math.PI / 2))
  }
  return exclusions
}

export function Discontinuities() {
  return (
    <Mafs viewBox={{ x: [-6, 6], y: [-3, 3] }}>
      <Coordinates.Cartesian subdivisions={4} />
      <Plot.OfX
        y={(x) => Math.tan(x)}
        exclusions={tanExclusions}
        svgPathProps={{ stroke: "var(--mafs-pink)" }}
      />
      <Plot.OfX
        y={(x) => (x < 0 ? x * x : Math.sin(x))}
        svgPathProps={{ stroke: "var(--mafs-green)" }}
      />
    </Mafs>
  )
}
