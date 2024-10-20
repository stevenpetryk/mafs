import * as React from "react"
import CoordinateContext, { CoordinateContextShape } from "../context/CoordinateContext"
import PaneManager from "../context/PaneContext"

import { round } from "../math"
import { vec } from "../vec"
import { TransformContext } from "../context/TransformContext"
import { SpanContext } from "../context/SpanContext"

export type ScenePropsT = React.PropsWithChildren<{
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

  /** Called when the view is clicked on, and passed the point where it was clicked. */
  onClick?: (point: vec.Vector2, event: MouseEvent) => void
}>

type SceneProps = {
  width: number
  height: number
  x: number
  y: number
} & Required<Pick<ScenePropsT, "viewBox" | "preserveAspectRatio">> &
  Pick<ScenePropsT, "children">

export function Scene({ x, y, width, height, viewBox, preserveAspectRatio, children }: SceneProps) {
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

  const xSpan = xMax - xMin
  const ySpan = yMax - yMin

  const viewTransform = React.useMemo(() => {
    const scaleX = round((1 / xSpan) * width, 5)
    const scaleY = round((-1 / ySpan) * height, 5)
    return vec.matrixBuilder().scale(scaleX, scaleY).get()
  }, [height, width, xSpan, ySpan])

  const viewTransformCSS = vec.toCSS(viewTransform)

  const coordinateContext = React.useMemo<CoordinateContextShape>(
    () => ({ xMin, xMax, yMin, yMax, height, width }),
    [xMin, xMax, yMin, yMax, height, width],
  )

  const id = React.useId()

  console.log({ xSpan, ySpan, viewTransformCSS, coordinateContext })

  return (
    <CoordinateContext.Provider value={coordinateContext}>
      <SpanContext.Provider value={{ xSpan, ySpan }}>
        <TransformContext.Provider
          value={{ userTransform: vec.identity, viewTransform: viewTransform }}
        >
          <PaneManager>
            <g
              transform={`translate(${x + width / 2} ${-y - height / 2})`}
              style={{
                ...({
                  "--mafs-view-transform": viewTransformCSS,
                  "--mafs-user-transform": "translate(0, 0)",
                } as React.CSSProperties),
              }}
            >
              <defs>
                <clipPath id={`scene-clip-${id}`}>
                  <rect
                    x={xMin}
                    y={yMin}
                    width={xSpan}
                    height={ySpan}
                    fill="white"
                    style={{ transform: "var(--mafs-view-transform)" }}
                  />
                </clipPath>
              </defs>
              <g clipPath={`url(#scene-clip-${id})`}>{children}</g>
            </g>
          </PaneManager>
        </TransformContext.Provider>
      </SpanContext.Provider>
    </CoordinateContext.Provider>
  )
}

Scene.displayName = "Scene"
