"use client"

export { Mafs } from "./view/Mafs"
export type { MafsProps } from "./view/Mafs"

export { Coordinates } from "./display/Coordinates"
export { autoPi as labelPi } from "./display/Coordinates/Cartesian"

export { Plot } from "./display/Plot"
export type { OfXProps, OfYProps, ParametricProps, VectorFieldProps } from "./display/Plot"

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

export { Polyline } from "./display/Polyline"
export type { PolylineProps } from "./display/Polyline"

export { Point } from "./display/Point"
export type { PointProps } from "./display/Point"

export { Vector } from "./display/Vector"
export type { VectorProps } from "./display/Vector"

export { Text } from "./display/Text"
export type { TextProps, CardinalDirection } from "./display/Text"

export { Theme } from "./display/Theme"
export type { Filled, Stroked } from "./display/Theme"

export { MovablePoint } from "./interaction/MovablePoint"
export type { MovablePointProps } from "./interaction/MovablePoint"

export { MovablePointDisplay } from "./display/MovablePointDisplay"
export type { MovablePointDisplayProps } from "./display/MovablePointDisplay"

export { useMovable } from "./interaction/useMovable"
export type { UseMovable, UseMovableArguments } from "./interaction/useMovable"

export { useMovablePoint } from "./interaction/useMovablePoint"
export type {
  ConstraintFunction,
  UseMovablePoint,
  UseMovablePointArguments,
} from "./interaction/useMovablePoint"

export { useStopwatch } from "./animation/useStopwatch"
export type { Stopwatch, StopwatchArguments } from "./animation/useStopwatch"

export type { Interval } from "./math"
export { vec } from "./vec"

export { Transform, type TransformProps } from "./display/Transform"

export { useTransformContext } from "./context/TransformContext"
export { usePaneContext } from "./context/PaneContext"

export { Debug } from "./debug"

export { LaTeX } from "./display/LaTeX"
