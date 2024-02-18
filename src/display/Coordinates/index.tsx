import { Cartesian } from "./Cartesian"
import { Dot } from "./Dot"
import { PolarCoordinates as Polar } from "./Polar"

// @ts-expect-error - setting these here to avoid invalid .d.ts output
Polar.displayName = "Coordinates.Polar"
// @ts-expect-error - setting these here to avoid invalid .d.ts output
Cartesian.displayName = "Coordinates.Cartesian"
// @ts-expect-error - setting these here to avoid invalid .d.ts output
Dot.displayName = "Coordinates.Dot"


export const Coordinates = {
    Cartesian,
    Polar,
    Dot,
}
