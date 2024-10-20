import * as React from "react";
import {
  Mafs,
  vec,
  Theme,
  Line,
  Coordinates,
  useMovablePoint,
  Plot
} from "mafs";

export default function PolarCoordinate() {
  const point1 = useMovablePoint([-2, -1]);
  const r = vec.mag(point1.point);
  let angle = Math.atan2(point1.point[1], point1.point[0]);

  // Adjust angle to always be positive, between 0 to 2π
  if (angle < 0) {
    angle += 2 * Math.PI;
  }

  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}
    >
      <Mafs viewBox={{ x: [-2, 2], y: [-4, 4] }} pan={false}>
        <Coordinates.Cartesian />
        <Line.Segment
          point1={[0, 0]}
          point2={[point1.point[0], 0]}
          color={Theme.blue}
        />
        <Line.Segment
          point1={[point1.point[0], 0]}
          point2={point1.point}
          color={Theme.blue}
        />

        {point1.element}
      </Mafs>

      <Mafs viewBox={{ x: [-2, 2], y: [-4, 4] }} pan={false}>
        <Coordinates.Polar subdivisions={3} lines={1} />
        <Line.Segment point1={[0, 0]} point2={[r, 0]} color={Theme.blue} />
        <Plot.Parametric
          t={[0, angle]}
          xy={(t) => [r * Math.cos(t), r * Math.sin(t)]}
          color={Theme.blue}
        />
        {point1.element}
      </Mafs>
    </div>
  );
}
