import * as React from "react"
import CoordinateContext, { CoordinateContextShape } from "../context/CoordinateContext"
import PaneManager from "../context/PaneContext"
import useResizeObserver from "use-resize-observer"

import { useGesture } from "@use-gesture/react"
import { round } from "../math"
import { vec } from "../vec"
import { TransformContext } from "../context/TransformContext"
import { SpanContext } from "../context/SpanContext"
import invariant from "tiny-invariant"
import { useCamera } from "../gestures/useCamera"

export type MafsProps = React.PropsWithChildren<{
  width?: number | "auto"
  height?: number

  /** Whether to enable panning with the mouse and keyboard */
  pan?: boolean

  /**
   * Whether to enable zooming with the mouse and keyboard. This can also be an
   * object with `min` and `max` properties to set the scale limits.
   *
   *  * `min` should be in the range (0, 1].
   *  * `max` should be in the range [1, ∞).
   */
  zoom?: boolean | { min: number; max: number }

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
}>

export function Mafs({
  width: desiredWidth = "auto",
  height = 500,
  pan = true,
  zoom = false,
  viewBox = { x: [-3, 3], y: [-3, 3] },
  preserveAspectRatio = "contain",
  children,
  ssr = false,
}: MafsProps) {
  const [visible, setVisible] = React.useState(ssr ? true : false)
  const desiredCssWidth = desiredWidth === "auto" ? "100%" : `${desiredWidth}px`

  const rootRef = React.useRef<HTMLDivElement>(null)
  const { width = ssr ? 500 : 1 } = useResizeObserver<HTMLDivElement>({ ref: rootRef })

  React.useEffect(() => {
    setVisible(true)
  }, [])

  let minZoom = 1
  let maxZoom = 1
  if (typeof zoom === "object") {
    invariant(zoom.min > 0 && zoom.min <= 1, "zoom.min must be in the range (0, 1]")
    invariant(zoom.max >= 1, "zoom.max must be in the range [1, ∞)")
    minZoom = zoom.min
    maxZoom = zoom.max
  } else if (zoom) {
    minZoom = 0.5
    maxZoom = 5
  }

  const camera = useCamera({ minZoom, maxZoom })

  const padding = viewBox?.padding ?? 0.5
  // Default behavior for `preserveAspectRatio == false`
  let xMin = (viewBox?.x?.[0] ?? 0) - padding
  let xMax = (viewBox?.x?.[1] ?? 0) + padding
  let yMin = (viewBox?.y?.[0] ?? 0) - padding
  let yMax = (viewBox?.y?.[1] ?? 0) + padding

  if (preserveAspectRatio === "contain") {
    const aspect = width / height
    const aoiAspect = (xMax - xMin) / (yMax - yMin)

    if (aoiAspect > aspect) {
      const yCenter = (yMax + yMin) / 2
      const ySpan = (xMax - xMin) / aspect / 2
      yMin = yCenter - ySpan
      yMax = yCenter + ySpan
    } else {
      const xCenter = (xMax + xMin) / 2
      const xSpan = ((yMax - yMin) * aspect) / 2
      xMin = xCenter - xSpan
      xMax = xCenter + xSpan
    }
  }

  ;[xMin, yMin] = vec.transform([xMin, yMin], camera.matrix)
  ;[xMax, yMax] = vec.transform([xMax, yMax], camera.matrix)

  const xSpan = xMax - xMin
  const ySpan = yMax - yMin

  const viewTransform = React.useMemo(() => {
    const scaleX = round((1 / xSpan) * width, 5)
    const scaleY = round((-1 / ySpan) * height, 5)
    return vec.matrixBuilder().scale(scaleX, scaleY).get()
  }, [height, width, xSpan, ySpan])

  const viewBoxX = round((xMin / (xMax - xMin)) * width, 10)
  const viewBoxY = round((yMax / (yMin - yMax)) * height, 10)

  const inverseViewTransform = vec.matrixInvert(viewTransform)

  const pickupOrigin = React.useRef<vec.Vector2>([0, 0])
  const pickupPoint = React.useRef<vec.Vector2>([0, 0])

  function mapGesturePoint(point: vec.Vector2): vec.Vector2 {
    const el = rootRef.current
    invariant(el, "SVG is not mounted")
    invariant(inverseViewTransform, "View transform is not invertible")

    const rect = el.getBoundingClientRect()
    return vec.transform(
      [point[0] - rect.left + viewBoxX, point[1] - rect.top + viewBoxY],
      inverseViewTransform
    )
  }

  useGesture(
    {
      onDrag: ({ movement, first, event, type, pinching, memo = [0, 0] }) => {
        if (pinching) return movement

        if (first) camera.setBase()
        const [mx, my] = vec.sub(movement, memo)

        camera.move({ pan: [(-mx / width) * xSpan, (my / height) * ySpan] })

        const keyboard = type.includes("key")
        if (keyboard) event?.preventDefault()
        return !keyboard && first ? movement : memo
      },
      onPinch: ({ first, movement: [scale], origin, event, last }) => {
        if (!event.currentTarget || !inverseViewTransform) return

        if (first) {
          camera.setBase()
          pickupOrigin.current = origin
          pickupPoint.current = pan
            ? mapGesturePoint(origin)
            : [(xMin + xMax) / 2, (yMin + yMax) / 2]
        }

        let offset: vec.Vector2 = [0, 0]
        if (pan) {
          offset = vec.transform(vec.sub(origin, pickupOrigin.current), inverseViewTransform)
        }
        camera.move({ zoom: { at: pickupPoint.current, scale }, pan: vec.scale(offset, -1) })

        // Commit the camera just in case we are transitioning into a drag
        // gesture (such as by lifting just one finger after pinching).
        if (last) camera.setBase()
      },
      onWheel: ({ pinching, event, delta: [, scroll] }) => {
        if (pinching) return

        // Simple sigmoid function to flatten extreme scrolling
        const scale = 2 / (1 + Math.exp(-scroll / 300))

        const point = mapGesturePoint([event.clientX, event.clientY])
        camera.setBase()
        camera.move({ zoom: { at: point, scale: 1 / scale } })
      },
      onKeyDown: ({ event }) => {
        // Avoid messing with browser zoom
        if (event.metaKey) return

        const base = { Equal: 1, Minus: -1 }[event.code] ?? 0
        if (!base) return

        let multiplier = 0.1
        if (event.altKey || event.metaKey) multiplier = 0.01
        if (event.shiftKey) multiplier = 0.3

        const scale = 1 + base * multiplier
        const center: vec.Vector2 = [(xMax + xMin) / 2, (yMax + yMin) / 2]

        camera.setBase()
        camera.move({ zoom: { at: center, scale } })
      },
    },
    {
      drag: { enabled: pan, eventOptions: { passive: false } },
      pinch: { enabled: !!zoom, eventOptions: { passive: false } },
      wheel: { enabled: !!zoom, preventDefault: true, eventOptions: { passive: false } },
      target: rootRef,
    }
  )

  const viewTransformCSS = vec.toCSS(viewTransform)

  const coordinateContext = React.useMemo<CoordinateContextShape>(
    () => ({ xMin, xMax, yMin, yMax, height, width }),
    [xMin, xMax, yMin, yMax, height, width]
  )

  return (
    <div
      className="MafsView"
      style={{ width: desiredCssWidth }}
      tabIndex={pan || zoom ? 0 : -1}
      ref={rootRef}
    >
      <CoordinateContext.Provider value={coordinateContext}>
        <SpanContext.Provider value={{ xSpan, ySpan }}>
          <TransformContext.Provider
            value={{ userTransform: vec.identity, viewTransform: viewTransform }}
          >
            <PaneManager>
              <svg
                width={width}
                height={height}
                viewBox={`${viewBoxX} ${viewBoxY} ${width} ${height}`}
                preserveAspectRatio="xMidYMin"
                style={{
                  width: desiredCssWidth,
                  touchAction: pan ? "none" : "auto",
                  ...({
                    "--mafs-view-transform": viewTransformCSS,
                    "--mafs-user-transform": "translate(0, 0)",
                  } as React.CSSProperties),
                }}
              >
                {visible && children}
              </svg>
            </PaneManager>
          </TransformContext.Provider>
        </SpanContext.Provider>
      </CoordinateContext.Provider>
    </div>
  )
}

Mafs.displayName = "Mafs"
