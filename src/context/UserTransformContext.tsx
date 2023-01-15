import * as React from "react"
import * as vec from "../vec"

export const UserTransformContext = React.createContext<vec.Matrix>(vec.matrixBuilder().get())

export function useUserTransform() {
  return React.useContext(UserTransformContext)
}
