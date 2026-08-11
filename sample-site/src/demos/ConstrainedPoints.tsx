import { Mafs, Coordinates, Line, useMovablePoint } from "mafs"

export function ConstrainedPoints() {
  // Horizontal constraint: y is locked. Dragging moves the point left/right
  // along the blue guide line.
  const horizontal = useMovablePoint([0.6, 0], { constrain: "horizontal" })
  const vertical = useMovablePoint([0, -0.8], { constrain: "vertical" })
  // Custom constraint + the #99 fix: the initial position is pushed through
  // the constraint on mount too, so this point starts snapped to x = 0 even
  // though we asked for x = 0.3.
  const snapped = useMovablePoint([0.3, 2.2], {
    constrain: ([x, y]) => [Math.round(x), y],
  })

  return (
    <Mafs viewBox={{ x: [-3, 3], y: [-3, 3], padding: 0.5 }}>
      <Coordinates.Cartesian subdivisions={2} />
      <Line.Segment point1={[-3, 0]} point2={[3, 0]} color="var(--mafs-blue)" opacity={0.4} />
      <Line.Segment point1={[0, -3]} point2={[0, 3]} color="var(--mafs-green)" opacity={0.4} />
      {horizontal.element}
      {vertical.element}
      {snapped.element}
    </Mafs>
  )
}
