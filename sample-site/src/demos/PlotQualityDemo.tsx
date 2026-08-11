import { Coordinates, Mafs, Plot, Text, Theme } from "mafs"

export function PlotQualityDemo() {
  return (
    <Mafs viewBox={{ x: [-6, 6], y: [-3.5, 4] }}>
      <Coordinates.Cartesian subdivisions={2} />
      <Plot.OfX
        y={(x) => 3 * Math.log10(x) + 1}
        domain={[0.08, 6]}
        color={Theme.green}
        weight={3}
      />
      <Plot.OfY
        x={(y) => 0.65 * Math.sin(y * 1.4)}
        domain={[-3.5, 3.5]}
        color={Theme.blue}
        weight={2}
      />
      <Plot.Parametric
        domain={[-Math.PI, Math.PI]}
        xy={(t) => [2.4 * Math.sin(t * 2), 0.7 * Math.cos(t * 3) + 2.1]}
        color={Theme.pink}
        weight={2}
      />
      <Text x={2.9} y={3.2} size={16} color={Theme.green}>
        log₁₀
      </Text>
    </Mafs>
  )
}
