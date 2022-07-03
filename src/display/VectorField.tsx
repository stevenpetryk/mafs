import * as React from "react"
import * as vec from "vec-la"

import { clamp, Vector2 } from "../math"
import { usePaneContext } from "../view/PaneManager"
import { useScaleContext } from "../view/ScaleContext"
import { Theme } from "./Theme"

export interface VectorFieldProps {
  xy: (x: number, y: number) => [number, number]
  xyOpacity?: (x: number, y: number) => number
  step: number
  opacityStep?: number
  color?: string
}

const xyOpacityDefault = () => 1

export const VectorField: React.VFC<VectorFieldProps> = ({
  xy,
  step = 1,
  xyOpacity = xyOpacityDefault,
  opacityStep = xyOpacity === xyOpacityDefault ? 1 : 0.2,
  color = Theme.foreground,
}) => {
  const { pixelMatrix } = useScaleContext()
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
        const tail: Vector2 = [x, y]
        const trueOffset = xy(x, y)
        const trueMag = vec.mag(trueOffset)
        const scaledOffset = vec.scale(vec.norm(trueOffset), Math.min(trueMag, step * 0.75))
        const tip = vec.add(tail, scaledOffset)

        const pixelTail = vec.transform(tail, pixelMatrix)
        const pixelTipOffset = vec.transform(scaledOffset, pixelMatrix)
        const pixelSize = vec.mag(pixelTipOffset)
        const pixelTip = vec.transform(tip, pixelMatrix)

        const arrowVector = vec.scale(vec.norm(pixelTipOffset), Math.min(pixelSize, 5))
        const left = vec.add(pixelTip, vec.rotate(arrowVector, (5 / 6) * Math.PI))
        const right = vec.add(pixelTip, vec.rotate(arrowVector, -(5 / 6) * Math.PI))

        const trueOpacity = xyOpacity(x, y)
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
