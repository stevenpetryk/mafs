import React from "react"

import { usePaneContext } from "../view/PaneManager"
import * as vec from "vec-la"
import { useScaleContext } from "view/ScaleContext"

export interface VectorFieldProps {
  xy: (x: number, y: number) => [number, number]
  step: number
  color?: string
}

export type Vector = [number, number]

const VectorField: React.VFC<VectorFieldProps> = ({ xy, step = 1, color = "var(--mafs-fg)" }) => {
  const { pixelMatrix } = useScaleContext()
  const { xPanes, yPanes } = usePaneContext()

  function fieldForRegion(xMin: number, xMax: number, yMin: number, yMax: number) {
    let d = ""

    for (let x = Math.floor(xMin); x <= Math.ceil(xMax); x += step) {
      for (let y = Math.floor(yMin); y <= Math.ceil(yMax); y += step) {
        const tail: Vector = [x, y]
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

        d +=
          ` M ${pixelTail[0]} ${pixelTail[1]}` +
          ` L ${pixelTip[0]} ${pixelTip[1]} ` +
          ` L ${left[0]} ${left[1]} ` +
          ` L ${right[0]} ${right[1]} ` +
          ` L ${pixelTip[0]} ${pixelTip[1]} `
      }
    }

    return d
  }

  const fields: string[] = []

  for (const [xMin, xMax] of xPanes) {
    for (const [yMin, yMax] of yPanes) {
      fields.push(fieldForRegion(xMin, xMax, yMin, yMax))
    }
  }

  return (
    <>
      {fields.map((d, index) => (
        <path
          d={d}
          key={index}
          style={{ stroke: color || "var(--mafs-fg)", fill: color || "var(--mafs-fg)" }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </>
  )
}

export default VectorField
