import { useState } from "react"
import {
  Coordinates,
  Line,
  Mafs,
  MovablePoint,
  Point,
  Plot,
  Text,
  Theme,
  useMovablePoint,
  vec,
} from "mafs"

const fn = (x: number) => 0.24 * x * x - 1

export function MovablesDemo() {
  const snapped = useMovablePoint([0.7, 0.7], {
    constrain: ([x, y]) => [Math.round(x), Math.round(y)],
  })
  const spacing = useMovablePoint([1, 0], { constrain: "horizontal" })
  const [buttonPoint, setButtonPoint] = useState<vec.Vector2>([2, fn(2)])
  const [clicks, setClicks] = useState(0)

  const spacingValue = Math.max(0.5, Math.abs(spacing.x))
  const functionPoints = Array.from({ length: 7 }, (_, index) => {
    const x = (index - 3) * spacingValue
    return [x, fn(x)] as vec.Vector2
  })

  return (
    <div className="movables-demo">
      <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }}>
        <Coordinates.Cartesian subdivisions={2} />
        <Plot.OfX y={fn} color={Theme.blue} weight={2} />
        <Line.Horizontal y={0} color={Theme.foreground} opacity={0.25} />
        {functionPoints.map(([x, y]) => (
          <Point key={[x, y].join("-")} x={x} y={y} color={Theme.green} opacity={0.8} />
        ))}
        <Text x={-3.25} y={2.5} size={15} color={Theme.green}>
          snap + function
        </Text>
        {snapped.element}
        {spacing.element}
        <MovablePoint
          point={buttonPoint}
          onMove={setButtonPoint}
          onClick={() => setClicks((count) => count + 1)}
          color={Theme.orange}
          svgGroupProps={{ "aria-label": "Clickable movable point" }}
        />
        <Text x={-3.25} y={-2.55} size={15} color={Theme.orange}>
          clicks: {clicks}
        </Text>
      </Mafs>
    </div>
  )
}
