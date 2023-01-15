import * as React from "react"
import * as vec from "../vec"
import { UserTransformContext, useUserTransform } from "../context/UserTransformContext"

export type TransformProps = React.PropsWithChildren<{
  matrix?: vec.Matrix
  translate?: vec.Vector2
  scale?: number | vec.Vector2
  rotate?: number
  shear?: vec.Vector2
}>

export function Transform(props: TransformProps) {
  const existingTransform = useUserTransform()

  let builder = vec.matrixBuilder()

  // Destructure props so that we can iterate over transforms in prop-order
  const { matrix, children, ...transforms } = props

  if (matrix) builder = builder.mult(matrix)

  for (const [name, value] of Object.entries(transforms)) {
    if (value == null) continue
    switch (name) {
      case "translate":
        builder = builder.translate(...(value as vec.Vector2))
        break
      case "scale":
        if (typeof value === "number") builder = builder.scale(value, value)
        else builder = builder.scale(...(value as vec.Vector2))
        break
      case "shear":
        builder = builder.shear(...(value as vec.Vector2))
        break
      case "rotate":
        builder = builder.rotate(value as number)
        break
    }
  }

  builder = builder.mult(existingTransform)

  const newTransform = builder.get()

  return (
    <UserTransformContext.Provider value={newTransform}>{children}</UserTransformContext.Provider>
  )
}
