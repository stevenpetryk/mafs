import { Cartesian } from "./Cartesian"
import { PolarCoordinates as Polar } from "./Polar"

// @ts-expect-error - setting these here to avoid invalid .d.ts output
Polar.displayName = "Coordinates.Polar"
// @ts-expect-error - setting these here to avoid invalid .d.ts output
Cartesian.displayName = "Coordinates.Cartesian"

export const Coordinates = {
  Cartesian,
  Polar,
}
