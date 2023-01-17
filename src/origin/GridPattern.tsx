import * as React from "react"
import { range } from "../math"
import { useTransformContext } from "../context/TransformContext"
import { vec } from "../vec"

interface GridPatternProps {
  id: string
  xLines: number | false
  yLines: number | false
  xSubdivisions: number | false
  ySubdivisions: number | false
}

/**
 * @private
 *
 * Creates an SVG <pattern> that looks like a cartesian coordinate plane grid.
 *
 * This is a bit more complex than just rendering lines, but is way more performant, since the
 * browser handles making the pattern repeat for us.
 */
function GridPattern({ id, xLines, yLines, xSubdivisions, ySubdivisions }: GridPatternProps) {
  const { viewTransform } = useTransformContext()

  const [width, invHeight] = vec.transform([xLines || 1, yLines || 1], viewTransform)
  const height = -invHeight

  let xs: number[] = []
  if (xSubdivisions && xSubdivisions > 1) {
    const pixelXDistance = width / xSubdivisions
    xs = range(0, width + pixelXDistance * 1.1, pixelXDistance)
  }

  let ys: number[] = []
  if (ySubdivisions && ySubdivisions > 1) {
    const pixelYDistance = height / ySubdivisions
    ys = range(0, height + pixelYDistance * 1.1, pixelYDistance)
  }

  return (
    <pattern id={id} x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
      {xs.map((x) => (
        <line
          key={x}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          style={{ stroke: "var(--grid-line-subdivision-color)" }}
        />
      ))}
      {ys.map((y) => (
        <line
          key={y}
          y1={y}
          x1={0}
          y2={y}
          x2={width}
          style={{ stroke: "var(--grid-line-subdivision-color)" }}
        />
      ))}

      {xLines && (
        <>
          <line x1={0} y1={0} x2={0} y2={height} style={{ stroke: "var(--mafs-line-color)" }} />
          <line
            x1={width}
            y1={0}
            x2={width}
            y2={height}
            style={{ stroke: "var(--mafs-line-color)" }}
          />
        </>
      )}

      {yLines && (
        <>
          <line x1={0} y1={0} x2={width} y2={0} style={{ stroke: "var(--mafs-line-color)" }} />
          <line
            x1={0}
            y1={height}
            x2={width}
            y2={height}
            style={{ stroke: "var(--mafs-line-color)" }}
          />
        </>
      )}
    </pattern>
  )
}

GridPattern.displayName = "CartesianCoordinates.GridPattern"

export default React.memo(GridPattern)
