import * as React from "react"
import * as vec from "../vec"

export type TransformProps = React.PropsWithChildren<{
  matrix?: vec.Matrix
  translate?: vec.Vector2
  scale?: number | vec.Vector2
  rotate?: number
  shear?: vec.Vector2
}>

const TransformContext = React.createContext<vec.Matrix>(vec.matrixBuilder().get())

export function useTransformContext() {
  return React.useContext(TransformContext)
}

export function Transform(props: TransformProps) {
  const existingTransform = React.useContext(TransformContext)

  let builder = vec.matrixBuilder(existingTransform)

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

  const newTransform = builder.get()

  return <TransformContext.Provider value={newTransform}>{children}</TransformContext.Provider>
}
