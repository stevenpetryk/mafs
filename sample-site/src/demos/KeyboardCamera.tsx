import { Mafs, Coordinates, Point, Polygon, vec } from "mafs"

export function KeyboardCamera() {
  const triangle: vec.Vector2[] = [
    [0, 1],
    [1, -0.8],
    [-1, -0.8],
  ]

  return (
    <Mafs pan zoom viewBox={{ x: [-2, 2], y: [-2, 2], padding: 1 }} preserveAspectRatio="contain">
      <Coordinates.Cartesian subdivisions={2} />
      <Polygon points={triangle} color="var(--mafs-green)" />
      <Point x={0} y={0.1} color="var(--mafs-yellow)" />
    </Mafs>
  )
}
