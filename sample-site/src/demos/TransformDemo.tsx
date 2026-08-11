import { Mafs, Coordinates, Transform, Line, Circle, Text } from "mafs"

export function TransformDemo() {
  const rot = Math.PI / 6

  return (
    <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }}>
      <Coordinates.Cartesian subdivisions={2} />

      {/* Untransformed reference */}
      <Line.Segment point1={[-1.5, 0]} point2={[-0.5, 0]} color="var(--mafs-fg)" opacity={0.4} />

      {/* Rotated + translated */}
      <Transform rotate={rot} translate={[1.5, 0]}>
        <Line.Segment point1={[-1.5, 0]} point2={[-0.5, 0]} color="var(--mafs-blue)" />
        <Circle center={[-1.5, 0]} radius={0.15} color="var(--mafs-pink)" />
      </Transform>

      {/* Scaled + sheared */}
      <Transform scale={1.5} shear={[0.8, 0]} translate={[-1, 1.5]}>
        <Line.Segment point1={[-1.5, 0]} point2={[-0.5, 0]} color="var(--mafs-green)" />
      </Transform>

      {/* Nested transforms compose */}
      <Transform translate={[1.5, 1.5]}>
        <Transform rotate={rot}>
          <Text x={0} y={0.25} color="var(--mafs-yellow)" size={22}>
            rotated
          </Text>
        </Transform>
      </Transform>
    </Mafs>
  )
}
