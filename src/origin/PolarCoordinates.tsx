import { usePaneContext } from "../context/PaneContext"
import { useTransformContext } from "../context/TransformContext"
import { range } from "../math"
import { vec } from "../vec"
import { XLabels, YLabels } from "./CartesianCoordinates"

const thetas = [
  1 * (Math.PI / 8),
  2 * (Math.PI / 8),
  3 * (Math.PI / 8),
  5 * (Math.PI / 8),
  6 * (Math.PI / 8),
  7 * (Math.PI / 8),
  9 * (Math.PI / 8),
  10 * (Math.PI / 8),
  11 * (Math.PI / 8),
  13 * (Math.PI / 8),
  14 * (Math.PI / 8),
  15 * (Math.PI / 8),
]

export function PolarCoordinates() {
  const { viewTransform } = useTransformContext()
  const { xPaneRange, yPaneRange } = usePaneContext()

  const [xMin, xMax] = xPaneRange
  const [yMin, yMax] = yPaneRange

  // Given these min and max values (the viewport),
  // find the minimum and maximum radius of circle
  // to display

  const distances = [
    vec.mag([xMin, yMin]),
    vec.mag([xMin, yMax]),
    vec.mag([xMax, yMin]),
    vec.mag([xMax, yMax]),
    vec.mag([(xMin + xMax) / 2, (yMin + yMax) / 2]),
  ]
  const b = 1

  const closeToOrigin = Math.min(...distances) < Math.max(xMax - xMin, yMax - yMin)
  const minRadiusPrecise = closeToOrigin ? 0 : Math.min(...distances)
  const maxRadiusPrecise = Math.max(...distances)

  const minRadius = Math.floor(minRadiusPrecise / b) * b
  const maxRadius = Math.ceil(maxRadiusPrecise / b) * b

  const [vxMin, vyMin] = vec.transform([xMin, yMin], viewTransform)
  const [vxMax, vyMax] = vec.transform([xMax, yMax], viewTransform)

  const [scaleX, scaleY] = vec.transform([1, -1], viewTransform)

  const rs = range(minRadius, maxRadius, b)
  const subRs = range(minRadius, maxRadius, b / 4)

  return (
    <g fill="none">
      <g stroke="var(--grid-line-subdivision-color)">
        {thetas.map((theta) => (
          <line
            key={theta}
            x1={0}
            y1={0}
            x2={Math.cos(theta) * maxRadius * scaleX}
            y2={-Math.sin(theta) * maxRadius * scaleY}
          />
        ))}
      </g>

      {subRs.map((r) => (
        <ellipse
          data-r={r}
          key={r}
          cx={0}
          cy={0}
          rx={r * scaleX}
          ry={r * scaleY}
          stroke="var(--grid-line-subdivision-color)"
        />
      ))}

      {rs.map((r) => (
        <ellipse
          data-r={r}
          key={r}
          cx={0}
          cy={0}
          rx={r * scaleX}
          ry={r * scaleY}
          stroke="var(--mafs-line-color)"
        />
      ))}

      <g stroke="var(--mafs-origin-color)">
        <line x1={vxMin} y1={0} x2={vxMax} y2={0} />
        <line x1={0} y1={vyMin} x2={0} y2={vyMax} />
      </g>

      <g className="mafs-shadow">
        <XLabels separation={1} labelMaker={(x) => x} />
        <YLabels separation={1} labelMaker={(y) => y} />
      </g>
    </g>
  )
}
