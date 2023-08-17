import * as React from "react"
import { vec } from "../algebra"
import type { Matrix2x3, Vector2 } from "../algebra/types"
import { TransformContext, useTransformContext } from "../context/TransformContext"

export type TransformProps = React.PropsWithChildren<{
  matrix?: Matrix2x3
  translate?: Vector2
  scale?: number | Vector2
  rotate?: number
  shear?: Vector2
}>

export function Transform(props: TransformProps) {
  const { userTransform, viewTransform } = useTransformContext()

  let builder = vec.matrixBuilder()

  // Destructure props so that we can iterate over transforms in prop-order
  const { matrix, children, ...transforms } = props

  if (matrix) builder = builder.mult(matrix)

  for (const [name, value] of Object.entries(transforms)) {
    if (value == null) continue
    switch (name) {
      case "translate":
        builder = builder.translate(...(value as Vector2))
        break
      case "scale":
        if (typeof value === "number") builder = builder.scale(value, value)
        else builder = builder.scale(...(value as Vector2))
        break
      case "shear":
        builder = builder.shear(...(value as Vector2))
        break
      case "rotate":
        builder = builder.rotate(value as number)
        break
    }
  }

  builder = builder.mult(userTransform)

  const newUserTransform = builder.get()

  return (
    <TransformContext.Provider value={{ userTransform: newUserTransform, viewTransform }}>
      <g style={{ "--mafs-user-transform": vec.toCSS(newUserTransform) } as React.CSSProperties}>
        {children}
      </g>
    </TransformContext.Provider>
  )
}

Transform.displayName = "Transform"
