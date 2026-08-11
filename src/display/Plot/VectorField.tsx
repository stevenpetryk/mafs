import * as React from "react"
import { clamp } from "../../math"
import { vec } from "../../vec"
import { usePaneContext } from "../../context/PaneContext"
import { Theme } from "../Theme"
import { useTransformContext } from "../../context/TransformContext"

export interface VectorFieldProps {
  xy: (point: vec.Vector2) => vec.Vector2
  xyOpacity?: (point: vec.Vector2) => number
  step: number
  opacityStep?: number
  color?: string
}

const xyOpacityDefault = () => 1

export function VectorField({
  xy,
  step = 1,
  xyOpacity = xyOpacityDefault,
  opacityStep = xyOpacity === xyOpacityDefault ? 1 : 0.2,
  color = Theme.foreground,
}: VectorFieldProps) {
  const { viewTransform, userTransform } = useTransformContext()
  const pixelMatrix = React.useMemo(
    () => vec.matrixMult(viewTransform, userTransform),
    [viewTransform, userTransform],
  )
  const { xPanes, yPanes } = usePaneContext()

  // Restrict the granularity of the opacity layers to a sane range.
  const clampedOpacityStep = Math.min(1, Math.max(0.01, opacityStep))

  const layers = React.useMemo(
    () => buildLayers(xPanes, yPanes, xy, xyOpacity, step, clampedOpacityStep, pixelMatrix),
    [xPanes, yPanes, xy, xyOpacity, step, clampedOpacityStep, pixelMatrix],
  )

  return (
    <>
      {layers.map((layer, index) => (
        <path
          d={layer.d}
          key={index}
          style={{
            stroke: color,
            fill: color,
            opacity: layer.opacity,
            fillOpacity: layer.opacity,
            strokeOpacity: layer.opacity,
          }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </>
  )
}

VectorField.displayName = "Plot.VectorField"

interface Layer {
  d: string
  opacity: number
}

function buildLayers(
  xPanes: [number, number][],
  yPanes: [number, number][],
  xy: (point: vec.Vector2) => vec.Vector2,
  xyOpacity: (point: vec.Vector2) => number,
  step: number,
  opacityStep: number,
  pixelMatrix: vec.Matrix,
): Layer[] {
  // Create one path per opacity "bucket" so that the field only needs a small
  // number of SVG elements regardless of how many vectors are drawn.
  const layers = generateOpacityLayers(Math.ceil(1 / opacityStep))

  for (const [xMin, xMax] of xPanes) {
    for (const [yMin, yMax] of yPanes) {
      fieldForRegion(xMin, xMax, yMin, yMax)
    }
  }

  function fieldForRegion(xMin: number, xMax: number, yMin: number, yMax: number) {
    // Iterate over grid points that are multiples of `step`, using a half-open
    // range so that adjacent panes don't draw the same vectors twice. Using an
    // index avoids accumulating floating point error when `step` is small.
    const xStart = Math.ceil(xMin / step - 1e-9) * step
    const yStart = Math.ceil(yMin / step - 1e-9) * step
    const xCount = Math.max(0, Math.ceil((xMax - xStart) / step - 1e-9))
    const yCount = Math.max(0, Math.ceil((yMax - yStart) / step - 1e-9))

    for (let i = 0; i < xCount; i++) {
      const x = xStart + i * step
      for (let j = 0; j < yCount; j++) {
        const y = yStart + j * step

        const tail: vec.Vector2 = [x, y]
        const trueOffset = xy([x, y])
        const trueMag = vec.mag(trueOffset)

        // Avoid rendering zero-length vectors
        if (trueMag === 0) continue

        const scaledOffset = vec.scale(vec.normalize(trueOffset), Math.min(trueMag, step * 0.75))
        const tip = vec.add(tail, scaledOffset)

        const pixelTail = vec.transform(tail, pixelMatrix)
        const pixelTipOffset = vec.transform(scaledOffset, pixelMatrix)
        const pixelSize = vec.mag(pixelTipOffset)
        const pixelTip = vec.transform(tip, pixelMatrix)

        const arrowVector = vec.scale(vec.normalize(pixelTipOffset), Math.min(pixelSize, 5))
        const left = vec.add(pixelTip, vec.rotate(arrowVector, (5 / 6) * Math.PI))
        const right = vec.add(pixelTip, vec.rotate(arrowVector, -(5 / 6) * Math.PI))

        const trueOpacity = xyOpacity([x, y])
        const layer = findClosestLayer(layers, trueOpacity)
        layer.d +=
          ` M ${pixelTail[0]} ${pixelTail[1]}` +
          ` L ${pixelTip[0]} ${pixelTip[1]} ` +
          ` L ${left[0]} ${left[1]} ` +
          ` L ${right[0]} ${right[1]} ` +
          ` L ${pixelTip[0]} ${pixelTip[1]} `
      }
    }
  }

  return layers
}

/**
 * Generates a list of layers. Each layer will eventually be converted to a
 * <path> with a certain opacity.
 *
 * The higher the opacityGrainularity, the more fidelity you get across
 * opacities, however the more layers you have, the more lag you get.
 *
 * @param opacityGrainularity the granularity of the opacity layers
 * @returns a list of layers
 */
function generateOpacityLayers(opacityGrainularity: number): Layer[] {
  const layers: Layer[] = []
  const step = 1 / opacityGrainularity
  for (let i = 1; i > 0; i -= step) {
    const layer: Layer = {
      d: "",
      opacity: i,
    }
    layers.push(layer)
  }
  return layers
}

/**
 * Takes in a pointOpacity (a number) and returns the layer it belongs to from layers.
 *
 * @param layers the layers to categorize pointOpacity to.
 * @param pointOpacity the opacity to categorize to a layer.
 * @return the layer that this opacity value belongs to.
 */
function findClosestLayer(layers: Layer[], pointOpacity: number): Layer {
  pointOpacity = clamp(pointOpacity, 0, 1)
  const index = layers.length - 1 - Math.round(pointOpacity * (layers.length - 1))
  return layers[index]
}
