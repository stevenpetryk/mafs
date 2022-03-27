import * as React from "react"
import CoordinateContext, { CoordinateContextShape } from "./CoordinateContext"
import PaneManager from "./PaneManager"
import MapContext from "./MapContext"
import useResizeObserver from "use-resize-observer"
import vec from "../vec"

import { useGesture } from "@use-gesture/react"
import ScaleContext, { ScaleContextShape } from "./ScaleContext"
import { round, Interval, Vector2 } from "../math"

export interface MafsViewProps {
  width?: number | string
  height?: number
  pan?: boolean
  xAxisExtent?: Interval
  yAxisExtent?: Interval
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
  xAxisExtent = [-5.5, 5.5],
  yAxisExtent = [-3.5, 3.5],
  children,
  ssr = false,
}) => {
  const [visible, setVisible] = React.useState(ssr ? true : false)
  const desiredCssWidth = desiredWidth === "auto" ? "100%" : `${desiredWidth}px`

  const { ref, width = ssr ? 500 : 1 } = useResizeObserver<HTMLDivElement>()

  React.useEffect(() => {
    setVisible(true)
  }, [visible])

  const [xMinDefault, xMaxDefault] = xAxisExtent
  const [yMinDefault, yMaxDefault] = yAxisExtent
  const [offset, setOffset] = React.useState<Vector2>([0, 0])
  const [xMin, yMin] = vec.add([xMinDefault, yMinDefault], offset)
  const [xMax, yMax] = vec.add([xMaxDefault, yMaxDefault], offset)

  const xSpan = xMax - xMin
  const ySpan = yMax - yMin

  const bind = useGesture(
    {
      onDrag: ({ offset: [mx, my] }) => {
        setOffset([(-mx / width) * xSpan, (my / height) * ySpan])
      },
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
      className="MafsWrapper overflow-hidden w-auto"
      style={{ width: desiredCssWidth }}
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
                className="MafsView"
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
