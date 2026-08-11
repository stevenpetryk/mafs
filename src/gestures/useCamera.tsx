import * as React from "react"
import { clamp } from "../math"
import { vec } from "../vec"

/**
 * Optional bounds that constrain how far the viewport can be panned. Each axis
 * is a `[min, max]` range that the *center* of the viewport is kept within.
 * Omitting an axis (or passing `[-Infinity, Infinity]`) leaves that axis
 * unconstrained, which allows limiting panning to specific directions.
 */
export interface PanBounds {
  x?: vec.Vector2
  y?: vec.Vector2
}

export function useCamera({
  minZoom,
  maxZoom,
  baseCenter = [0, 0],
  panBounds,
}: {
  minZoom: number
  maxZoom: number
  /** The center of the viewport before any camera transformation is applied. */
  baseCenter?: vec.Vector2
  /** Optional bounds to constrain panning to (#115). */
  panBounds?: PanBounds
}) {
  const [matrix, setMatrix] = React.useState<vec.Matrix>(vec.identity)
  const matrixRef = React.useRef<vec.Matrix>(vec.identity)
  const initialMatrix = React.useRef<vec.Matrix>(vec.identity)
  const pendingMatrix = React.useRef<vec.Matrix | null>(null)
  const frame = React.useRef<number | null>(null)

  // Pointer and pinch gestures can produce more events than a browser can
  // paint. Coalesce those updates to one React render per animation frame;
  // this keeps camera movement responsive without rebuilding the whole scene
  // for every raw pointer event (#55).
  React.useEffect(
    () => () => {
      if (frame.current !== null && typeof cancelAnimationFrame !== "undefined") {
        cancelAnimationFrame(frame.current)
      }
    },
    [],
  )

  function publish(nextMatrix: vec.Matrix) {
    matrixRef.current = nextMatrix
    pendingMatrix.current = nextMatrix

    if (typeof requestAnimationFrame === "undefined") {
      pendingMatrix.current = null
      setMatrix(nextMatrix)
      return
    }

    if (frame.current !== null) return

    frame.current = requestAnimationFrame(() => {
      frame.current = null
      const next = pendingMatrix.current
      pendingMatrix.current = null
      if (next) setMatrix(next)
    })
  }

  // Keeps the viewport center within the configured pan bounds by applying a
  // corrective translation to the camera matrix.
  function clampPan(camera: vec.Matrix): vec.Matrix {
    if (!panBounds) return camera

    const center = vec.transform(baseCenter, camera)
    let dx = 0
    let dy = 0

    if (panBounds.x) {
      const [min, max] = panBounds.x
      if (center[0] < min) dx = min - center[0]
      else if (center[0] > max) dx = max - center[0]
    }
    if (panBounds.y) {
      const [min, max] = panBounds.y
      if (center[1] < min) dy = min - center[1]
      else if (center[1] > max) dy = max - center[1]
    }

    if (dx !== 0 || dy !== 0) {
      return vec.matrixBuilder(camera).translate(dx, dy).get()
    }
    return camera
  }

  return {
    matrix: matrix,
    setBase() {
      initialMatrix.current = matrixRef.current
    },
    move({ zoom, pan }: { zoom?: { at: vec.Vector2; scale?: number }; pan?: vec.Vector2 }) {
      const scale = 1 / (zoom?.scale ?? 1)
      const zoomAt = zoom?.at ?? [0, 0]

      const currentScale = initialMatrix.current[0]
      const minScale = 1 / maxZoom / currentScale
      const maxScale = 1 / minZoom / currentScale

      /**
       * Represents the amount of scaling to apply such that we never exceed the
       * minimum or maximum zoom level.
       */
      const clampedScale = clamp(scale, minScale, maxScale)

      const newCamera = clampPan(
        vec
          .matrixBuilder(initialMatrix.current)
          .translate(...vec.scale(zoomAt, -1))
          .scale(clampedScale, clampedScale)
          .translate(...vec.scale(zoomAt, 1))
          .translate(...(pan ?? [0, 0]))
          .get(),
      )

      publish(newCamera)
    },
  }
}
