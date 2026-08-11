import { Coordinates, Line, Mafs, Plot, Text, Theme } from "mafs"

export function FoundationsDemo() {
  return (
    <div className="theme-swatch">
      <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }}>
        <Coordinates.Cartesian subdivisions={2} />
        <Line.Horizontal y={1} color={Theme.blue} style="dashed" />
        <Line.Vertical x={-2} color={Theme.green} />
        <Plot.OfY x={(y) => Math.sin(y) * 0.7} domain={[-3, 3]} color={Theme.orange} weight={3} />
        <Line.Bezier
          start={[-3, -2]}
          control1={[-1, 2.5]}
          control2={[1, -2.5]}
          end={[3, 1.5]}
          color={Theme.pink}
          weight={3}
        />
        <Text x={-2.7} y={2.35} size={18} color={Theme.blue}>
          primitives
        </Text>
      </Mafs>
    </div>
  )
}
