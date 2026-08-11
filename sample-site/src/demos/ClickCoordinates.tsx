import { useState } from "react"
import { Mafs, Coordinates, Point, Text, vec } from "mafs"

export function ClickCoordinates() {
  const [point, setPoint] = useState<vec.Vector2>([0, 0])

  return (
    <Mafs
      viewBox={{ x: [-4, 4], y: [-3, 3] }}
      zoom={{ min: 0.5, max: 4 }}
      onClick={(point) => setPoint(point)}
    >
      <Coordinates.Cartesian subdivisions={2} />
      <Point x={point[0]} y={point[1]} color="var(--mafs-red)" />
      <Text attach="w" x={point[0]} y={point[1]} size={18} color="var(--mafs-red)">
        ({point.map((n) => n.toFixed(2)).join(", ")})
      </Text>
    </Mafs>
  )
}
