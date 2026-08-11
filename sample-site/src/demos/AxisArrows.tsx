import { Mafs, Coordinates } from "mafs"

export function AxisArrows() {
  return (
    <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }} pan zoom>
      <Coordinates.Cartesian
        subdivisions={4}
        xAxis={{ axisArrow: true }}
        yAxis={{ axisArrow: true }}
      />
    </Mafs>
  )
}
