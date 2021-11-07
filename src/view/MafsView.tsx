import React, { useCallback, useEffect, useMemo, useState } from "react"
import CoordinateContext, { CoordinateContextShape } from "./CoordinateContext"
import PaneManager from "./PaneManager"
import useResizeObserver from "use-resize-observer"
import * as vec from "vec-la"

import { useGesture } from "@use-gesture/react"
import ScaleContext, { ScaleContextShape } from "./ScaleContext"
import { round, Interval, Vector2, matrixInvert } from "../math"

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

const MafsView: React.FC<MafsViewProps> = ({
  width: desiredWidth = "auto",
  height = 500,
  pan = true,
  xAxisExtent = [-5.5, 5.5],
  yAxisExtent = [-3.5, 3.5],
  children,
  ssr = false,
}) => {
  const [visible, setVisible] = useState(ssr ? true : false)
  const desiredCssWidth = desiredWidth === "auto" ? "100%" : `${desiredWidth}px`

  const { ref, width = ssr ? 500 : 1 } = useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    setVisible(true)
  }, [visible])

  const [xMinDefault, xMaxDefault] = xAxisExtent
  const [yMinDefault, yMaxDefault] = yAxisExtent
  const [offset, setOffset] = useState<Vector2>([0, 0])
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

  const xToPixels = useMemo(
    () =>
      vec
        .matrixBuilder()
        .scale(width / xSpan, 1)
        .get(),
    [width, xSpan]
  )

  const yToPixels = useMemo(
    () =>
      vec
        .matrixBuilder()
        .scale(1, -height / ySpan)
        .get(),
    [height, ySpan]
  )

  const toPixels = useMemo(() => vec.composeTransform(xToPixels, yToPixels), [xToPixels, yToPixels])
  const fromPixels = useMemo(() => matrixInvert(toPixels)!, [toPixels])

  const scaleX = useCallback((x: number) => vec.transform([x, 1], xToPixels)[0], [xToPixels])
  const scaleY = useCallback((y: number) => vec.transform([1, y], yToPixels)[1], [yToPixels])

  const cssTransform = useMemo(() => {
    const m = toPixels
    return `matrix(${m[0]},${m[3]},${m[1]},${m[4]},${m[2]},${m[5]})`
  }, [toPixels])

  const coordinateContext = useMemo<CoordinateContextShape>(
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

  const scaleContext = useMemo<ScaleContextShape>(
    () => ({
      scaleX,
      scaleY,
      pixelMatrix: toPixels,
      inversePixelMatrix: fromPixels,
      cssScale: cssTransform,
      xSpan,
      ySpan,
    }),
    [scaleX, scaleY, xSpan, ySpan, toPixels, fromPixels, cssTransform]
  )

  const mapX = useCallback(
    (x: number) => round(((x - xMin) / (xMax - xMin)) * width),
    [xMin, xMax, width]
  )

  const mapY = useCallback(
    (y: number) => round(((y - yMax) / (yMin - yMax)) * height),
    [yMin, yMax, height]
  )

  return (
    <div className="MafsWrapper" style={{ width: desiredCssWidth }} ref={ref} {...bind()}>
      <CoordinateContext.Provider value={coordinateContext}>
        <ScaleContext.Provider value={scaleContext}>
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
        </ScaleContext.Provider>
      </CoordinateContext.Provider>
    </div>
  )
}

export default MafsView
