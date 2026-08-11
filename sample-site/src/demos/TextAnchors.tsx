import { Mafs, Coordinates, Point, Text } from "mafs"

export function TextAnchors() {
  return (
    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3], padding: 0.5 }}>
      <Coordinates.Cartesian subdivisions={2} />
      <Point x={0} y={0} color="var(--mafs-red)" />
      <Text attach="n" x={0} y={0} color="var(--mafs-blue)">
        north
      </Text>
      <Text attach="s" x={0} y={0} color="var(--mafs-blue)">
        south
      </Text>
      <Text attach="e" x={0} y={0} color="var(--mafs-yellow)">
        east
      </Text>
      <Text attach="w" x={0} y={0} color="var(--mafs-yellow)">
        west
      </Text>
      <Text attach="ne" x={0} y={0} color="var(--mafs-green)">
        northeast
      </Text>
      <Text attach="sw" x={0} y={0} color="var(--mafs-violet)">
        southwest
      </Text>
    </Mafs>
  )
}
