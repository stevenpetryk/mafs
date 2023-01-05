export { MafsView as Mafs } from "./view/MafsView"
export type { MafsViewProps } from "./view/MafsView"

export { CartesianCoordinates, autoPi as labelPi } from "./origin/CartesianCoordinates"
export type {
  CartesianCoordinatesProps,
  AxisOptions,
  LabelMaker,
} from "./origin/CartesianCoordinates"

export { FunctionGraph } from "./display/FunctionGraph"
export type { OfXProps, ParametricProps } from "./display/FunctionGraph"

export { Line } from "./display/Line"
export type {
  PointAngleProps,
  PointSlopeProps,
  ThroughPointsProps,
  SegmentProps,
} from "./display/Line"

export { Circle } from "./display/Circle"
export type { CircleProps } from "./display/Circle"

export { Ellipse } from "./display/Ellipse"
export type { EllipseProps } from "./display/Ellipse"

export { Polygon } from "./display/Polygon"
export type { PolygonProps } from "./display/Polygon"

export { Point } from "./display/Point"
export type { PointProps } from "./display/Point"

export { Vector } from "./display/Vector"
export type { VectorProps } from "./display/Vector"

export { VectorField } from "./display/VectorField"
export type { VectorFieldProps } from "./display/VectorField"

export { Text } from "./display/Text"
export type { TextProps, CardinalDirection } from "./display/Text"

export { Theme } from "./display/Theme"
export type { Filled, Stroked } from "./display/Theme"

export { MovablePoint } from "./interaction/MovablePoint"
export type { MovablePointProps } from "./interaction/MovablePoint"

export { useMovablePoint } from "./interaction/useMovablePoint"
export type {
  ConstraintFunction,
  UseMovablePoint,
  UseMovablePointArguments,
} from "./interaction/useMovablePoint"

export { useStopwatch } from "./animation/useStopwatch"
export type { Stopwatch, StopwatchArguments } from "./animation/useStopwatch"

export type { Interval } from "./math"

export type { Vector2, Matrix } from "./vec"

// Some wonk here because Parcel doesn't understand the export * as syntax
export { vec } from "./vec"

export { Transform, type TransformProps } from "./display/Transform"
