import * as React from "react"
import CoordinateContext, { CoordinateContextShape } from "./CoordinateContext"
import PaneManager from "./PaneManager"
import MapContext from "./MapContext"
import useResizeObserver from "use-resize-observer"

import { useDrag } from "@use-gesture/react"
import ScaleContext, { ScaleContextShape } from "./ScaleContext"
import { round } from "../math"
import * as vec from "../vec"

export interface MafsViewProps {
  width?: number | "auto"
  height?: number
  /** Whether to enable panning with the mouse and keyboard */
  pan?: boolean
  /**
   * A way to declare the "area of interest" of your visualizations. Mafs will center and zoom to
   * this area.
   */
  viewBox?: { x?: vec.Vector2; y?: vec.Vector2; padding?: number }
  /**
   * Whether to squish the graph to fill the Mafs viewport or to preserve the aspect ratio of the
   * coordinate space.
   */
  preserveAspectRatio?: "contain" | false

  /**
   * Enable rendering on the server side. If false, an empty view will still be rendered, with
   * nothing in it.
   *
   * Note that server-side rendering complicated graphs can really bloat your HTML.
   */
  ssr?: boolean
}

export const MafsView: React.FC<MafsViewProps> = ({
  width: desiredWidth = "auto",
  height = 500,
  pan = true,
  viewBox = { x: [-3, 3], y: [-3, 3] },
  preserveAspectRatio = "contain",
  children,
  ssr = false,
}) => {
  const [visible, setVisible] = React.useState(ssr ? true : false)
  const desiredCssWidth = desiredWidth === "auto" ? "100%" : `${desiredWidth}px`

  const { ref, width = ssr ? 500 : 1 } = useResizeObserver<HTMLDivElement>()

  React.useEffect(() => {
    setVisible(true)
  }, [])

  const aspect = width / height

  const [offset, setOffset] = React.useState<vec.Vector2>([0, 0])

  const padding = viewBox?.padding ?? 0.5
  const aoi = {
    xMin: (viewBox?.x?.[0] ?? 0) - padding + offset[0],
    xMax: (viewBox?.x?.[1] ?? 0) + padding + offset[0],
    yMin: (viewBox?.y?.[0] ?? 0) - padding + offset[1],
    yMax: (viewBox?.y?.[1] ?? 0) + padding + offset[1],
  }

  // Default behavior for `preserveAspectRatio == false`
  let xMin = aoi.xMin
  let xMax = aoi.xMax
  let yMin = aoi.yMin
  let yMax = aoi.yMax

  if (preserveAspectRatio === "contain") {
    const aoiAspect = (aoi.xMax - aoi.xMin) / (aoi.yMax - aoi.yMin)
    if (aoiAspect > aspect) {
      const yCenter = (aoi.yMax + aoi.yMin) / 2
      const ySpan = (aoi.xMax - aoi.xMin) / aspect / 2
      yMin = yCenter - ySpan
      yMax = yCenter + ySpan
    } else {
      const xCenter = (aoi.xMax + aoi.xMin) / 2
      const xSpan = ((aoi.yMax - aoi.yMin) * aspect) / 2
      xMin = xCenter - xSpan
      xMax = xCenter + xSpan
    }
  }

  const xSpan = xMax - xMin
  const ySpan = yMax - yMin

  const bind = useDrag(
    ({ offset: [mx, my], event, type }) => {
      // Prevent document scroll
      if (type.includes("key")) event.preventDefault()
      setOffset([(-mx / width) * xSpan, (my / height) * ySpan])
    },
    { enabled: pan }
  )

  const mapX = React.useCallback(
    (x: number) => round(((x - xMin) / (xMax - xMin)) * width),
    [xMin, xMax, width]
  )

  const mapY = React.useCallback(
    (y: number) => round(((y - yMax) / (yMin - yMax)) * height),
    [yMin, yMax, height]
  )

  const scaleX = React.useCallback((x: number) => round((x / xSpan) * width, 5), [xSpan, width])
  const scaleY = React.useCallback((y: number) => round((-y / ySpan) * height, 5), [ySpan, height])
  const unscaleX = React.useCallback((x: number) => round((x / width) * xSpan, 5), [xSpan, width])
  const unscaleY = React.useCallback(
    (y: number) => round((-y / height) * ySpan, 5),
    [ySpan, height]
  )
  const pixelMatrix = React.useMemo(
    () => vec.matrixBuilder().scale(scaleX(1), scaleY(1)).get(),
    [scaleX, scaleY]
  )
  const inversePixelMatrix = React.useMemo(
    () => vec.matrixBuilder().scale(unscaleX(1), unscaleY(1)).get(),
    [unscaleX, unscaleY]
  )

  const cssScale = `scale(${scaleX(1)} ${scaleY(1)})`

  const coordinateContext = React.useMemo<CoordinateContextShape>(
    () => ({
      xMin,
      xMax,
      yMin,
      yMax,
      height,
      width,
    }),
    [xMin, xMax, yMin, yMax, height, width]
  )

  const scaleContext = React.useMemo<ScaleContextShape>(
    () => ({
      scaleX,
      scaleY,
      pixelMatrix,
      inversePixelMatrix,
      cssScale,
      xSpan,
      ySpan,
    }),
    [scaleX, scaleY, xSpan, ySpan, pixelMatrix, inversePixelMatrix, cssScale]
  )

  return (
    <div
      className="MafsView"
      style={{ width: desiredCssWidth }}
      tabIndex={pan ? 0 : -1}
      ref={ref}
      {...bind()}
    >
      <CoordinateContext.Provider value={coordinateContext}>
        <ScaleContext.Provider value={scaleContext}>
          <MapContext.Provider value={{ mapX, mapY }}>
            <PaneManager>
              <svg
                width={width}
                height={height}
                viewBox={`${-mapX(0)} ${-mapY(0)} ${width} ${height}`}
                preserveAspectRatio="xMidYMin"
                style={{ width: desiredCssWidth, touchAction: pan ? "none" : "auto" }}
              >
                {visible && children}
              </svg>
            </PaneManager>
          </MapContext.Provider>
        </ScaleContext.Provider>
      </CoordinateContext.Provider>
    </div>
  )
}
