// ─── Top-level payload ──────────────────────────────────────────────

/** The complete JSON payload that drives the MathFlow renderer */
export interface MathFlowPayload {
  /** Unique identifier for this visualization */
  id: string
  /** Display title */
  title: string
  /** Optional subtitle */
  subtitle?: string
  /** Difficulty level indicator */
  difficulty?: "basic" | "intermediate" | "advanced"
  /** Ordered list of content blocks to render */
  blocks: MathFlowBlock[]
  /** Optional guided exploration steps */
  steps?: MathFlowStep[]
  /** Optional challenge/quiz */
  challenge?: MathFlowChallenge
}

// ─── Block types (discriminated union) ──────────────────────────────

/** A single content block in the MathFlow layout */
export type MathFlowBlock =
  | TextBlock
  | GraphBlock
  | SliderGroupBlock
  | VennBlock
  | TruthTableBlock
  | UnitCircleBlock
  | EquationStepsBlock
  | NumberLineBlock
  | ValueTableBlock

export interface TextBlock {
  type: "text"
  id?: string
  /** Markdown-like text content. KaTeX via $...$ if katex is true. */
  content: string
  /** Whether to render inline KaTeX expressions (default: false) */
  katex?: boolean
}

export interface GraphBlock {
  type: "graph"
  id?: string
  /** Graph configuration */
  config: GraphConfig
}

export interface SliderGroupBlock {
  type: "slider_group"
  id?: string
  /** Slider group configuration */
  config: SliderGroupConfig
}

export interface VennBlock {
  type: "venn"
  id?: string
  /** Venn diagram configuration */
  config: VennConfig
}

export interface TruthTableBlock {
  type: "truth_table"
  id?: string
  /** Truth table configuration */
  config: TruthTableConfig
}

export interface UnitCircleBlock {
  type: "unit_circle"
  id?: string
  /** Unit circle configuration */
  config: UnitCircleConfig
}

export interface EquationStepsBlock {
  type: "equation_steps"
  id?: string
  /** Equation steps configuration */
  config: EquationStepsConfig
}

export interface NumberLineBlock {
  type: "number_line"
  id?: string
  /** Number line configuration */
  config: NumberLineConfig
}

export interface ValueTableBlock {
  type: "value_table"
  id?: string
  /** Value table configuration */
  config: ValueTableConfig
}

// ─── Block config types ─────────────────────────────────────────────

/** Configuration for a 2D graph block (wraps Mafs + Plot) */
export interface GraphConfig {
  /** Coordinate viewbox */
  viewBox?: { x?: [number, number]; y?: [number, number] }
  /** Height in pixels (default: 400) */
  height?: number
  /** Whether panning is enabled (default: false) */
  pan?: boolean
  /** Whether zooming is enabled (default: false) */
  zoom?: boolean
  /** Functions to plot */
  functions?: GraphFunction[]
  /** Points to display */
  points?: GraphPoint[]
  /** Line segments to display */
  lines?: GraphLine[]
  /** Annotations to display */
  annotations?: GraphAnnotation[]
}

/** A function to plot on the graph */
export interface GraphFunction {
  /** Math expression with x as variable, may use parameter templates */
  expression: string
  /** Line color (default: Theme.blue) */
  color?: string
  /** Line style (default: "solid") */
  style?: "solid" | "dashed"
  /** Line weight (default: 2) */
  weight?: number
  /** Domain restriction [xMin, xMax] */
  domain?: [number, number]
}

/** A point on the graph */
export interface GraphPoint {
  /** X coordinate (number or expression with parameter templates) */
  x: number | string
  /** Y coordinate (number or expression with parameter templates) */
  y: number | string
  /** Point color */
  color?: string
  /** Optional label */
  label?: string
  /** Whether this point is draggable via useMovablePoint */
  movable?: boolean
  /** Math expression to constrain point to a curve (e.g. "x^2"). Uses existing compileWithParams. */
  constraintExpression?: string
  /** Maps point position back to slider params for bidirectional sync */
  syncParams?: { x?: string; y?: string }
}

/** A line segment on the graph */
export interface GraphLine {
  /** Start point */
  from: [number | string, number | string]
  /** End point */
  to: [number | string, number | string]
  /** Line color */
  color?: string
  /** Line style */
  style?: "solid" | "dashed"
}

/** An annotation on the graph */
export interface GraphAnnotation {
  /** Position in math-space */
  position: [number, number]
  /** Label text */
  label: string
  /** Visual style */
  style?: "callout" | "badge" | "minimal"
  /** Color */
  color?: string
}

/** Configuration for a slider group */
export interface SliderGroupConfig {
  /** The sliders in this group */
  sliders: SliderConfig[]
}

/** Configuration for a single slider */
export interface SliderConfig {
  /** Unique id used for parameter linking (e.g., "a") */
  id: string
  /** Display name */
  name: string
  /** Minimum value */
  min: number
  /** Maximum value */
  max: number
  /** Step increment (default: 0.1) */
  step?: number
  /** Default/initial value */
  default: number
  /** Optional display label */
  label?: string
  /** Slider color */
  color?: string
}

/** Configuration for a Venn diagram */
export interface VennConfig {
  /** Sets to display */
  sets: Array<{
    id: string
    label: string
    elements: (string | number)[]
    color?: string
  }>
  /** Regions to highlight */
  highlights?: string[]
  /** Whether to show elements (default: true) */
  showElements?: boolean
  /** Whether regions are clickable (default: false) */
  interactive?: boolean
  /** Width in pixels */
  width?: number
  /** Height in pixels */
  height?: number
}

/** Configuration for a truth table */
export interface TruthTableConfig {
  /** Variable names */
  variables: string[]
  /** Logical expressions */
  expressions: string[]
  /** Rows to highlight */
  highlightRows?: number[]
  /** Whether interactive fill-in mode is enabled */
  interactive?: boolean
}

/** Configuration for the unit circle */
export interface UnitCircleConfig {
  /** Initial angle in radians */
  angle?: number
  /** Show sin line */
  showSin?: boolean
  /** Show cos line */
  showCos?: boolean
  /** Show tan line */
  showTan?: boolean
  /** Show angle arc */
  showArc?: boolean
  /** Whether draggable */
  draggable?: boolean
  /** Label mode */
  labelMode?: "radians" | "degrees" | "both"
  /** Show special angle markers */
  specialAngles?: boolean
  /** Width in pixels */
  width?: number
  /** Height in pixels */
  height?: number
}

/** Configuration for equation steps */
export interface EquationStepsConfig {
  /** The steps */
  steps: Array<{
    expression: string
    annotation?: string
    highlight?: "left" | "right" | "both" | "result"
  }>
  /** Whether to animate */
  animated?: boolean
  /** Use KaTeX rendering */
  katex?: boolean
}

/** Configuration for a number line */
export interface NumberLineConfig {
  /** Range [min, max] */
  range: [number, number]
  /** Points to display */
  points?: Array<{
    value: number
    label?: string
    color?: string
    draggable?: boolean
  }>
  /** Intervals to display */
  intervals?: Array<{
    start: number
    end: number
    color?: string
    opacity?: number
    label?: string
    startInclusive?: boolean
    endInclusive?: boolean
  }>
  /** Tick configuration */
  ticks?: { step: number; labels?: boolean }
  /** Height in pixels */
  height?: number
}

/** Configuration for a value table */
export interface ValueTableConfig {
  /** Functions to evaluate */
  functions: Array<{
    /** Math expression with x as variable */
    expression: string
    /** Display label */
    label: string
  }>
  /** X values to evaluate at */
  xValues: number[]
  /** Whether to highlight rows where functions are equal */
  highlightIntersections?: boolean
}

// ─── Steps and challenges ───────────────────────────────────────────

/** A guided exploration step */
export interface MathFlowStep {
  /** Step title */
  title: string
  /** Step description (supports KaTeX via $...$) */
  description: string
  /** Override block properties at this step (keyed by block id) */
  blockOverrides?: Record<string, Record<string, unknown>>
  /** Block id to visually highlight */
  highlightBlock?: string
}

/** A challenge/quiz for the user */
export interface MathFlowChallenge {
  /** Challenge prompt text */
  prompt: string
  /** Challenge type */
  type: "slider_target" | "point_target" | "multiple_choice" | "free_input"
  /** Validation rules */
  validation: {
    target: number | string | number[]
    tolerance?: number
  }
  /** Optional hints */
  hints?: string[]
}
