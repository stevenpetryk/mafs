import { Mafs, Coordinates, Polygon, Text } from "mafs"

export function PanBounds() {
  return (
    <Mafs
      pan={{ x: [-2, 2], y: [-2, 2] }}
      zoom={{ min: 1, max: 4 }}
      viewBox={{ x: [-3, 3], y: [-3, 3] }}
      preserveAspectRatio="contain"
    >
      <Coordinates.Cartesian subdivisions={2} />
      <Polygon
        points={[
          [-2, -2],
          [2, -2],
          [2, 2],
          [-2, 2],
        ]}
        color="var(--mafs-blue)"
        fillOpacity={0.07}
        svgPolygonProps={{ strokeDasharray: "5 4" }}
      />
      <Text x={0} y={0} color="var(--mafs-blue)" size={22}>
        pan region
      </Text>
    </Mafs>
  )
}
