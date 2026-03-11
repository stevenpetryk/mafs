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

export { Image } from "./display/Image"
export type { ImageProps } from "./display/Image"

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

// ─── New MathFlow components ────────────────────────────────────────

// Core components
export { Slider } from "./display/Slider"
export type { SliderProps } from "./display/Slider"

export { NumberLine } from "./display/NumberLine"
export type {
  NumberLineProps,
  NumberLinePoint,
  NumberLineInterval,
  NumberLineTicks,
} from "./display/NumberLine"

export { Annotation } from "./display/Annotation"
export type { AnnotationProps, AnnotationStyle } from "./display/Annotation"

export { Region } from "./display/Region"
export type { RegionProps, RegionPattern } from "./display/Region"

// Standalone visualizations
export { VennDiagram } from "./standalone/VennDiagram"
export type { VennDiagramProps, VennSet, VennHighlight } from "./standalone/VennDiagram"

export { UnitCircle } from "./standalone/UnitCircle"
export type { UnitCircleProps, UnitCircleLabelMode } from "./standalone/UnitCircle"

export { EquationSteps } from "./standalone/EquationSteps"
export type { EquationStepsProps, EquationStep } from "./standalone/EquationSteps"

export { TruthTable } from "./standalone/TruthTable"
export type { TruthTableProps } from "./standalone/TruthTable"

// JSON Renderer
export { MathFlowRenderer } from "./mathflow/MathFlowRenderer"
export type { MathFlowRendererProps } from "./mathflow/MathFlowRenderer"
export type {
  MathFlowPayload,
  MathFlowBlock,
  MathFlowStep,
  MathFlowChallenge,
  GraphConfig,
  GraphFunction,
  GraphPoint,
  GraphLine,
  GraphAnnotation,
  SliderGroupConfig,
  SliderConfig,
  VennConfig,
  TruthTableConfig,
  UnitCircleConfig,
  EquationStepsConfig,
  NumberLineConfig,
  ValueTableConfig,
} from "./mathflow/types"

// Expression utilities
export {
  substituteParams,
  compileExpression,
  compileWithParams,
  evaluateNumeric,
} from "./mathflow/ExpressionParser"
