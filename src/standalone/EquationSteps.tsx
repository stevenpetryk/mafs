import * as React from "react"
import katex from "katex"

/** A single step in the equation solving process */
export interface EquationStep {
  /** The math expression (rendered with KaTeX if katex prop is true) */
  expression: string
  /** Annotation explaining this step */
  annotation?: string
  /** Which parts to highlight: "left", "right", "both", "result" */
  highlight?: "left" | "right" | "both" | "result"
}

/** Props for the EquationSteps component */
export interface EquationStepsProps {
  /** The equation steps to display */
  steps: EquationStep[]
  /** Whether to animate step reveal (default: false) */
  animated?: boolean
  /** Current step index (controlled). Shows all steps up to this index. */
  currentStep?: number
  /** Whether to render expressions with KaTeX (default: true) */
  katex?: boolean
  /** Called when step changes via navigation */
  onStepChange?: (step: number) => void
}

function KaTeXExpression({ tex, highlight }: { tex: string; highlight?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true })
    } catch {
      if (ref.current) ref.current.textContent = tex
    }
  }, [tex])

  return (
    <span
      ref={ref}
      className={`mafs-equation-expression ${highlight ? `mafs-equation-highlight-${highlight}` : ""}`}
    />
  )
}

/**
 * Renders a vertical sequence of equations with annotations.
 * Supports KaTeX rendering, step-by-step reveal, and highlighting
 * of changed parts between steps.
 */
export function EquationSteps({
  steps,
  animated = false,
  currentStep,
  katex: useKatex = true,
  onStepChange,
}: EquationStepsProps) {
  const [internalStep, setInternalStep] = React.useState(steps.length - 1)
  const activeStep = currentStep ?? internalStep
  const visibleSteps = steps.slice(0, activeStep + 1)

  const goNext = React.useCallback(() => {
    const next = Math.min(activeStep + 1, steps.length - 1)
    setInternalStep(next)
    onStepChange?.(next)
  }, [activeStep, steps.length, onStepChange])

  const goPrev = React.useCallback(() => {
    const prev = Math.max(activeStep - 1, 0)
    setInternalStep(prev)
    onStepChange?.(prev)
  }, [activeStep, onStepChange])

  return (
    <div className="MafsView mafs-equation-steps">
      <div className="mafs-equation-steps-list">
        {visibleSteps.map((step, i) => (
          <div
            key={i}
            className={`mafs-equation-step ${i === activeStep ? "mafs-equation-step-active" : ""}`}
            style={
              animated
                ? {
                    opacity: 1,
                    transform: "translateY(0)",
                    transition: `opacity 0.4s ease ${i * 0.15}s, transform 0.4s ease ${i * 0.15}s`,
                  }
                : undefined
            }
          >
            {/* Step number */}
            <div className="mafs-equation-step-number">{i + 1}</div>

            {/* Expression */}
            <div className="mafs-equation-step-content">
              {useKatex ? (
                <KaTeXExpression tex={step.expression} highlight={step.highlight} />
              ) : (
                <code className="mafs-equation-step-code">{step.expression}</code>
              )}
            </div>

            {/* Annotation */}
            {step.annotation && (
              <div className="mafs-equation-step-annotation">{step.annotation}</div>
            )}

            {/* Connecting line to next step */}
            {i < visibleSteps.length - 1 && <div className="mafs-equation-step-connector" />}
          </div>
        ))}
      </div>

      {/* Navigation */}
      {steps.length > 1 && (
        <div className="mafs-equation-nav">
          <button
            className="mafs-equation-nav-btn"
            onClick={goPrev}
            disabled={activeStep <= 0}
            aria-label="Previous step"
          >
            ← Prev
          </button>
          <span className="mafs-equation-nav-info">
            Step {activeStep + 1} of {steps.length}
          </span>
          <button
            className="mafs-equation-nav-btn"
            onClick={goNext}
            disabled={activeStep >= steps.length - 1}
            aria-label="Next step"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

EquationSteps.displayName = "EquationSteps"
