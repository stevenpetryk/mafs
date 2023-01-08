import { OfX, OfY } from "./Plot/Simple"
import { Parametric } from "./Plot/Parametric"
import { VectorField } from "./Plot/VectorField"

export const Plot = {
  OfX,
  OfY,
  Parametric,
  VectorField,
}

// @ts-expect-error - setting these here to avoid invalid .d.ts output
Plot.OfX.displayName = "Plot.OfX"
// @ts-expect-error - setting these here to avoid invalid .d.ts output
Plot.OfY.displayName = "Plot.OfY"
// @ts-expect-error - setting these here to avoid invalid .d.ts output
Plot.Parametric.displayName = "Plot.Parametric"
// @ts-expect-error - setting these here to avoid invalid .d.ts output
Plot.VectorField.displayName = "Plot.VectorField"

import type { OfXProps, OfYProps } from "./Plot/Simple"
import type { ParametricProps } from "./Plot/Parametric"
import type { VectorFieldProps } from "./Plot/VectorField"
export type { OfXProps, OfYProps, ParametricProps, VectorFieldProps }
