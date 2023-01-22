import { Mafs, Coordinates, Circle, useMovablePoint, Theme, Debug } from "../../src"

export function MafsDragging() {
  const point1 = useMovablePoint([0, 0], { color: Theme.blue })
  const point2 = useMovablePoint([0, 1], { color: Theme.red })
  const point3 = useMovablePoint([0, 2], { color: Theme.green })

  return (
    <Mafs>
      <Coordinates.Cartesian />

      <Circle center={point1.point} radius={0.5} />
      <Circle center={point2.point} radius={0.5} />
      <Circle center={point3.point} radius={0.5} />

      <Debug.ViewportInfo />

      {point1.element}
      {point2.element}
      {point3.element}
    </Mafs>
  )
}
