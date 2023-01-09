import { clamp, round } from "../../math"
import * as vec from "../../vec"
import * as React from "react"
import { usePaneContext } from "../../view/PaneManager"
import { useScaleContext } from "../../view/ScaleContext"
import { Theme } from "../Theme"

export interface VectorFieldProps {
  xy: (point: vec.Vector2) => vec.Vector2
  xyOpacity?: (point: vec.Vector2) => number
  step: number
  color?: string
}

const xyOpacityDefault = () => 1

export function VectorField({
  xy,
  step = 1,
  xyOpacity = xyOpacityDefault,
  color = Theme.foreground,
}: VectorFieldProps) {
  const maskId = `mafs-vector-field-${React.useId()}`

  const { pixelMatrix, cssScale } = useScaleContext()
  const { xPanes, yPanes, xPaneRange, yPaneRange } = usePaneContext()

  function fieldForRegion(xMin: number, xMax: number, yMin: number, yMax: number) {
    let d = ""
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

        d +=
          ` M ${round(pixelTail[0], 1)} ${round(pixelTail[1], 1)}` +
          ` L ${round(pixelTip[0], 1)} ${round(pixelTip[1], 1)} ` +
          ` L ${round(left[0], 1)} ${round(left[1], 1)} ` +
          ` L ${round(right[0], 1)} ${round(right[1], 1)} ` +
          ` L ${round(pixelTip[0], 1)} ${round(pixelTip[1], 1)} `
      }
    }
    return { d, uri: "" }
  }

  const panes: { d: string; uri: string }[] = []
  for (const [xMin, xMax] of xPanes) {
    for (const [yMin, yMax] of yPanes) {
      panes.push(fieldForRegion(xMin, xMax, yMin, yMax))
    }
  }

  const dataUri = React.useMemo(() => {
    const width = 100
    const height = 100

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.createImageData(width, height)

    const xStep = (xPaneRange[1] - xPaneRange[0]) / width
    const yStep = (yPaneRange[1] - yPaneRange[0]) / height
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const trueOpacity = xyOpacity([xPaneRange[0] + x * xStep, yPaneRange[0] + y * yStep])

        const c = Math.round(clamp(0, 255, trueOpacity * 255))

        imageData.data[(x + y * width) * 4 + 0] = c
        imageData.data[(x + y * width) * 4 + 1] = c
        imageData.data[(x + y * width) * 4 + 2] = c
        imageData.data[(x + y * width) * 4 + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL()
  }, [xPaneRange, yPaneRange, xyOpacity])

  return (
    <>
      {xyOpacity !== xyOpacityDefault && (
        <mask id={maskId}>
          <image
            x={xPaneRange[0]}
            y={-xPaneRange[1]}
            transform={cssScale}
            width={xPaneRange[1] - xPaneRange[0]}
            height={yPaneRange[1] - yPaneRange[0]}
            href={dataUri}
          />
        </mask>
      )}

      {panes.map((pane, i) => (
        <path
          d={pane.d}
          key={i}
          style={{ stroke: color, fill: color }}
          strokeLinecap="round"
          strokeLinejoin="round"
          mask={`url(#${maskId})`}
        />
      ))}
    </>
  )
}
