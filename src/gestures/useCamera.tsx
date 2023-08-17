import * as React from "react"
import { clamp } from "../math"

import { vec } from "../algebra"
import type { Matrix2x3, Vector2 } from "../algebra/types"

export function useCamera({ minZoom, maxZoom }: { minZoom: number; maxZoom: number }) {
  const [matrix, setMatrix] = React.useState<Matrix2x3>(vec.identity())
  const initialMatrix = React.useRef<Matrix2x3>(vec.identity())

  return {
    matrix: matrix,
    setBase() {
      initialMatrix.current = matrix
    },
    move({ zoom, pan }: { zoom?: { at: Vector2; scale?: number }; pan?: Vector2 }) {
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

      const newCamera = vec
        .matrixBuilder(initialMatrix.current)
        .translate(...vec.scale(zoomAt, -1))
        .scale(clampedScale, clampedScale)
        .translate(...vec.scale(zoomAt, 1))
        .translate(...(pan ?? [0, 0]))
        .get()

      setMatrix(newCamera)
    },
  }
}
