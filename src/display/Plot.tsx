import { OfX, OfY } from "./Plot/Simple"
import { Parametric } from "./Plot/Parametric"
import { VectorField } from "./Plot/VectorField"
import { Inequality } from "./Plot/Inequality"

export const Plot = {
  OfX,
  OfY,
  Parametric,
  VectorField,
  Inequality,
}

import type { InequalityProps } from "./Plot/Inequality"
import type { OfXProps, OfYProps } from "./Plot/Simple"
import type { ParametricProps } from "./Plot/Parametric"
import type { VectorFieldProps } from "./Plot/VectorField"
export type { InequalityProps, OfXProps, OfYProps, ParametricProps, VectorFieldProps }
