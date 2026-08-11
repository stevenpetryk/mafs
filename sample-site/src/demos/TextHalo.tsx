import { Mafs, Coordinates, Text } from "mafs"

export function TextHalo() {
  return (
    <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }}>
      <Coordinates.Cartesian />
      <Text attach="n" x={-2.2} y={0} color="var(--mafs-green)" size={28}>
        crisp green
      </Text>
      <Text attach="n" x={0} y={0} color="var(--mafs-orange)" size={28}>
        crisp orange
      </Text>
      <Text attach="n" x={2.2} y={0} color="var(--mafs-yellow)" size={28}>
        crisp yellow
      </Text>
    </Mafs>
  )
}
