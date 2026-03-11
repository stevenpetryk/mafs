import * as React from "react"
import type {
  MathFlowPayload,
  MathFlowBlock,
  MathFlowStep,
  MathFlowChallenge,
  GraphConfig,
  SliderGroupConfig,
} from "./types"
import { BlockErrorBoundary } from "./BlockErrorBoundary"
import { compileWithParams, evaluateNumeric } from "./ExpressionParser"

// Components
import { Mafs } from "../view/Mafs"
import { Coordinates } from "../display/Coordinates"
import { Plot } from "../display/Plot"
import { Point } from "../display/Point"
import { Text } from "../display/Text"
import { Line } from "../display/Line"
import { Annotation } from "../display/Annotation"
import { Slider } from "../display/Slider"
import { NumberLine } from "../display/NumberLine"
import { VennDiagram } from "../standalone/VennDiagram"
import { TruthTable } from "../standalone/TruthTable"
import { UnitCircle } from "../standalone/UnitCircle"
import { EquationSteps } from "../standalone/EquationSteps"
import { ValueTableBlock } from "./ValueTableBlock"
import { Theme } from "../display/Theme"
import { vec } from "../vec"
import katex from "katex"

// ─── Renderer Props ─────────────────────────────────────────────────

/** Props for the MathFlowRenderer component */
export interface MathFlowRendererProps {
  /** The JSON payload describing the visualization */
  payload: MathFlowPayload
  /** Current guided step index (controlled) */
  currentStep?: number
  /** Called when step changes via navigation */
  onStepChange?: (step: number) => void
  /** Called when a challenge answer is submitted */
  onChallengeSubmit?: (answer: unknown) => void
  /** Color theme (default: "light") */
  theme?: "light" | "dark"
}

// ─── Color resolver ─────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  blue: Theme.blue,
  red: Theme.red,
  green: Theme.green,
  orange: Theme.orange,
  pink: Theme.pink,
  indigo: Theme.indigo,
  violet: Theme.violet,
  yellow: Theme.yellow,
}

function resolveColor(color?: string): string | undefined {
  if (!color) return undefined
  return COLOR_MAP[color] ?? color
}

// ─── Block renderers ────────────────────────────────────────────────

function TextBlockRenderer({ block }: { block: MathFlowBlock & { type: "text" } }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const hasMath = block.katex || /\$[^$]+\$/.test(block.content)

  React.useEffect(() => {
    if (!ref.current || !hasMath) return
    // Replace $...$ with KaTeX rendered spans
    const html = block.content.replace(/\$([^$]+)\$/g, (_, tex) => {
      try {
        return katex.renderToString(tex, { throwOnError: false })
      } catch {
        return tex
      }
    })
    ref.current.innerHTML = html
  }, [block.content, hasMath])

  if (hasMath) {
    return <div ref={ref} className="mafs-block-text mafs-block-text-katex" />
  }
  return <div className="mafs-block-text">{block.content}</div>
}

function GraphBlockRenderer({
  config,
  params,
}: {
  config: GraphConfig
  params: Record<string, number>
}) {
  const viewBox = config.viewBox ?? {}

  return (
    <Mafs
      height={config.height ?? 400}
      viewBox={{
        x: (viewBox.x as vec.Vector2) ?? [-5, 5],
        y: (viewBox.y as vec.Vector2) ?? [-5, 5],
      }}
      pan={config.pan ?? false}
      zoom={config.zoom ?? false}
    >
      <Coordinates.Cartesian />

      {/* Functions */}
      {config.functions?.map((fn, i) => {
        const evaluate = compileWithParams(fn.expression, params)
        return (
          <Plot.OfX
            key={`fn-${i}`}
            y={evaluate}
            color={resolveColor(fn.color) ?? Theme.blue}
            style={fn.style ?? "solid"}
            weight={fn.weight ?? 2}
            domain={fn.domain as vec.Vector2 | undefined}
          />
        )
      })}

      {/* Points */}
      {config.points?.map((pt, i) => {
        const x = evaluateNumeric(pt.x, params)
        const y = evaluateNumeric(pt.y, params)
        return (
          <React.Fragment key={`pt-${i}`}>
            <Point x={x} y={y} color={resolveColor(pt.color)} />
            {pt.label && (
              <Text x={x} y={y + 0.3} size={14} color={resolveColor(pt.color)}>
                {pt.label}
              </Text>
            )}
          </React.Fragment>
        )
      })}

      {/* Lines */}
      {config.lines?.map((ln, i) => {
        const x1 = evaluateNumeric(ln.from[0], params)
        const y1 = evaluateNumeric(ln.from[1], params)
        const x2 = evaluateNumeric(ln.to[0], params)
        const y2 = evaluateNumeric(ln.to[1], params)
        return (
          <Line.Segment
            key={`ln-${i}`}
            point1={[x1, y1]}
            point2={[x2, y2]}
            color={resolveColor(ln.color)}
            style={ln.style ?? "solid"}
          />
        )
      })}

      {/* Annotations */}
      {config.annotations?.map((ann, i) => (
        <Annotation
          key={`ann-${i}`}
          position={ann.position}
          label={ann.label}
          style={ann.style}
          color={resolveColor(ann.color)}
        />
      ))}
    </Mafs>
  )
}

function SliderGroupRenderer({
  config,
  params,
  onParamChange,
}: {
  config: SliderGroupConfig
  params: Record<string, number>
  onParamChange: (id: string, value: number) => void
}) {
  return (
    <div className="mafs-slider-group">
      {config.sliders.map((slider) => (
        <Slider
          key={slider.id}
          name={slider.name}
          min={slider.min}
          max={slider.max}
          step={slider.step ?? 0.1}
          value={params[slider.id] ?? slider.default}
          onChange={(v) => onParamChange(slider.id, v)}
          label={slider.label}
          color={resolveColor(slider.color)}
        />
      ))}
    </div>
  )
}

// ─── Step navigation ────────────────────────────────────────────────

function StepNavigation({
  steps,
  currentStep,
  onStepChange,
}: {
  steps: MathFlowStep[]
  currentStep: number
  onStepChange: (step: number) => void
}) {
  const step = steps[currentStep]
  const descRef = React.useRef<HTMLDivElement>(null)
  const description = step?.description

  React.useEffect(() => {
    if (!descRef.current || !description) return
    const html = description.replace(/\$([^$]+)\$/g, (_, tex) => {
      try {
        return katex.renderToString(tex, { throwOnError: false })
      } catch {
        return tex
      }
    })
    descRef.current.innerHTML = html
  }, [description])

  if (!step) return null

  return (
    <div className="mafs-step-nav">
      <div className="mafs-step-nav-header">
        <h3 className="mafs-step-nav-title">{step.title}</h3>
        <span className="mafs-step-nav-counter">
          {currentStep + 1} / {steps.length}
        </span>
      </div>
      <div ref={descRef} className="mafs-step-nav-description" />
      <div className="mafs-step-nav-buttons">
        <button
          className="mafs-step-nav-btn"
          onClick={() => onStepChange(currentStep - 1)}
          disabled={currentStep <= 0}
        >
          ← Previous
        </button>
        <button
          className="mafs-step-nav-btn"
          onClick={() => onStepChange(currentStep + 1)}
          disabled={currentStep >= steps.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

// ─── Challenge UI ───────────────────────────────────────────────────

function ChallengeUI({
  challenge,
  params,
  onSubmit,
}: {
  challenge: MathFlowChallenge
  params: Record<string, number>
  onSubmit?: (answer: unknown) => void
}) {
  const [answer, setAnswer] = React.useState("")
  const [showHint, setShowHint] = React.useState(0)
  const [result, setResult] = React.useState<"correct" | "incorrect" | null>(null)

  const handleSubmit = React.useCallback(() => {
    const target = challenge.validation.target
    const tolerance = challenge.validation.tolerance ?? 0.01

    let correct = false
    if (challenge.type === "free_input") {
      correct = answer.trim() === String(target)
    } else if (challenge.type === "slider_target" && typeof target === "number") {
      // Check if any slider is close to target
      const values = Object.values(params)
      correct = values.some((v) => Math.abs(v - target) <= tolerance)
    }

    setResult(correct ? "correct" : "incorrect")
    onSubmit?.(answer)
  }, [answer, challenge, params, onSubmit])

  return (
    <div className="mafs-challenge">
      <div className="mafs-challenge-prompt">{challenge.prompt}</div>

      {challenge.type === "free_input" && (
        <input
          className="mafs-challenge-input"
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer..."
          aria-label="Challenge answer"
        />
      )}

      <div className="mafs-challenge-actions">
        <button className="mafs-challenge-submit" onClick={handleSubmit}>
          Submit
        </button>
        {challenge.hints && showHint < challenge.hints.length && (
          <button className="mafs-challenge-hint-btn" onClick={() => setShowHint((h) => h + 1)}>
            Hint ({showHint}/{challenge.hints.length})
          </button>
        )}
      </div>

      {/* Hints */}
      {challenge.hints?.slice(0, showHint).map((hint, i) => (
        <div key={i} className="mafs-challenge-hint">
          {hint}
        </div>
      ))}

      {/* Result */}
      {result && (
        <div className={`mafs-challenge-result mafs-challenge-result-${result}`}>
          {result === "correct" ? "Correct!" : "Not quite. Try again!"}
        </div>
      )}
    </div>
  )
}

// ─── Main renderer ──────────────────────────────────────────────────

/**
 * The MathFlow JSON renderer. Takes a structured JSON payload
 * and renders the correct interactive visualization.
 *
 * - Manages slider/interaction state internally
 * - Supports guided steps with block overrides
 * - Includes challenge/quiz UI
 * - Error boundaries prevent individual block failures from crashing everything
 */
export function MathFlowRenderer({
  payload,
  currentStep: controlledStep,
  onStepChange: onStepChangeProp,
  onChallengeSubmit,
  theme = "light",
}: MathFlowRendererProps) {
  // ── Slider state ──
  const [params, setParams] = React.useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    for (const block of payload.blocks) {
      if (block.type === "slider_group") {
        for (const slider of block.config.sliders) {
          initial[slider.id] = slider.default
        }
      }
    }
    return initial
  })

  const handleParamChange = React.useCallback((id: string, value: number) => {
    setParams((prev) => ({ ...prev, [id]: value }))
  }, [])

  // ── Step state ──
  const [internalStep, setInternalStep] = React.useState(0)
  const activeStep = controlledStep ?? internalStep
  const handleStepChange = React.useCallback(
    (step: number) => {
      setInternalStep(step)
      onStepChangeProp?.(step)

      // Apply step overrides to params
      const stepDef = payload.steps?.[step]
      if (stepDef?.blockOverrides) {
        for (const block of payload.blocks) {
          if (block.type === "slider_group" && block.id && stepDef.blockOverrides[block.id]) {
            const overrides = stepDef.blockOverrides[block.id] as Record<string, unknown>
            if (overrides.values && typeof overrides.values === "object") {
              setParams((prev) => ({ ...prev, ...(overrides.values as Record<string, number>) }))
            }
          }
        }
      }
    },
    [onStepChangeProp, payload],
  )

  // ── Apply step overrides to block configs ──
  const getBlockConfig = React.useCallback(
    (block: MathFlowBlock): MathFlowBlock => {
      if (!payload.steps || !block.id) return block

      const stepDef = payload.steps[activeStep]
      if (!stepDef?.blockOverrides?.[block.id]) return block

      const overrides = stepDef.blockOverrides[block.id]
      if (block.type === "text") {
        return { ...block, ...overrides } as MathFlowBlock
      }
      if ("config" in block) {
        return {
          ...block,
          config: { ...block.config, ...overrides },
        } as MathFlowBlock
      }
      return block
    },
    [payload.steps, activeStep],
  )

  // ── Render a single block ──
  const renderBlock = React.useCallback(
    (block: MathFlowBlock, index: number) => {
      const resolvedBlock = getBlockConfig(block)
      const isHighlighted = payload.steps?.[activeStep]?.highlightBlock === block.id

      return (
        <div
          key={block.id ?? index}
          className={`mafs-block ${isHighlighted ? "mafs-block-highlighted" : ""}`}
        >
          <BlockErrorBoundary blockId={block.id ?? `block-${index}`}>
            {renderBlockContent(resolvedBlock, params, handleParamChange)}
          </BlockErrorBoundary>
        </div>
      )
    },
    [getBlockConfig, params, handleParamChange, payload.steps, activeStep],
  )

  return (
    <div className="mathflow-renderer" data-theme={theme}>
      {/* Header */}
      <div className="mathflow-header">
        <h2 className="mathflow-title">{payload.title}</h2>
        {payload.subtitle && <p className="mathflow-subtitle">{payload.subtitle}</p>}
      </div>

      {/* Blocks */}
      <div className="mathflow-blocks">
        {payload.blocks.map((block, i) => renderBlock(block, i))}
      </div>

      {/* Step navigation */}
      {payload.steps && payload.steps.length > 0 && (
        <StepNavigation
          steps={payload.steps}
          currentStep={activeStep}
          onStepChange={handleStepChange}
        />
      )}

      {/* Challenge */}
      {payload.challenge && (
        <ChallengeUI challenge={payload.challenge} params={params} onSubmit={onChallengeSubmit} />
      )}
    </div>
  )
}

/** Renders the content of a single block based on its type */
function renderBlockContent(
  block: MathFlowBlock,
  params: Record<string, number>,
  onParamChange: (id: string, value: number) => void,
): React.ReactNode {
  switch (block.type) {
    case "text":
      return <TextBlockRenderer block={block} />

    case "graph":
      return <GraphBlockRenderer config={block.config} params={params} />

    case "slider_group":
      return (
        <SliderGroupRenderer config={block.config} params={params} onParamChange={onParamChange} />
      )

    case "venn":
      return (
        <VennDiagram
          sets={block.config.sets}
          highlights={block.config.highlights}
          showElements={block.config.showElements}
          interactive={block.config.interactive}
          width={block.config.width}
          height={block.config.height}
        />
      )

    case "truth_table":
      return (
        <TruthTable
          variables={block.config.variables}
          expressions={block.config.expressions}
          highlightRows={block.config.highlightRows}
          interactive={block.config.interactive}
        />
      )

    case "unit_circle":
      return (
        <UnitCircle
          angle={block.config.angle}
          showSin={block.config.showSin}
          showCos={block.config.showCos}
          showTan={block.config.showTan}
          showArc={block.config.showArc}
          draggable={block.config.draggable}
          labelMode={block.config.labelMode}
          specialAngles={block.config.specialAngles}
          width={block.config.width}
          height={block.config.height}
        />
      )

    case "equation_steps":
      return (
        <EquationSteps
          steps={block.config.steps}
          animated={block.config.animated}
          katex={block.config.katex}
        />
      )

    case "number_line":
      return (
        <NumberLine
          range={block.config.range}
          points={block.config.points}
          intervals={block.config.intervals}
          ticks={block.config.ticks}
          height={block.config.height}
        />
      )

    case "value_table":
      return <ValueTableBlock config={block.config} params={params} />

    default:
      return (
        <div className="mafs-block-unknown">
          Unknown block type: {(block as MathFlowBlock & { type: string }).type}
        </div>
      )
  }
}

MathFlowRenderer.displayName = "MathFlowRenderer"
