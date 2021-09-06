import range from "lodash.range"
import React from "react"
import { useScaleContext } from "../view/ScaleContext"

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
const GridPattern: React.VFC<GridPatternProps> = ({
  id,
  xLines,
  yLines,
  xSubdivisions,
  ySubdivisions,
}) => {
  const { scaleX, scaleY } = useScaleContext()

  const width = scaleX(xLines || 1)
  const height = -scaleY(yLines || 1)

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

export default React.memo(GridPattern)
