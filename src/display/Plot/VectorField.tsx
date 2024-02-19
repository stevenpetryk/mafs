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
  const { viewTransform: pixelMatrix } = useTransformContext()
  const { xPanes, yPanes } = usePaneContext()

  //Impose restrictions on opacityStep
  opacityStep = Math.min(1, Math.max(0.01, opacityStep))
  //Calculate granularity from step
  const opacityGrainularity = Math.ceil(1 / opacityStep)
  //Create layers
  const layers = generateOpacityLayers(opacityGrainularity)

  function fieldForRegion(xMin: number, xMax: number, yMin: number, yMax: number) {
    for (let x = Math.floor(xMin); x <= Math.ceil(xMax); x += step) {
      for (let y = Math.floor(yMin); y <= Math.ceil(yMax); y += step) {
        const tail: vec.Vector2 = [x, y]
        const trueOffset = xy([x, y])
        const trueMag = vec.mag(trueOffset)
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
        const layer = findClosetLayer(layers, trueOpacity)
        layer.d +=
          ` M ${pixelTail[0]} ${pixelTail[1]}` +
          ` L ${pixelTip[0]} ${pixelTip[1]} ` +
          ` L ${left[0]} ${left[1]} ` +
          ` L ${right[0]} ${right[1]} ` +
          ` L ${pixelTip[0]} ${pixelTip[1]} `
      }
    }
  }

  for (const [xMin, xMax] of xPanes) {
    for (const [yMin, yMax] of yPanes) {
      fieldForRegion(xMin, xMax, yMin, yMax)
    }
  }

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

/**
 * Generates a list of layers. Each layer will eventually be convereted to a <path>
 * with a certain opacity.
 *
 * The higher the opacityGrainularity, the more fidelity you get accross opacities,
 * however the more layers you have, the more lag you get.
 *
 * @param opacityGrainularity the granulity of the opacity layers
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
 * @param layers the layers to catagorize pointOpacity to.
 * @param pointOpacity the opacity to categorize to a layer.
 * @return the layer that this opacity value belongs to.
 */
function findClosetLayer(layers: Layer[], pointOpacity: number): Layer {
  pointOpacity = clamp(pointOpacity, 0, 1)
  const index = layers.length - 1 - Math.round(pointOpacity * (layers.length - 1))
  return layers[index]
}
