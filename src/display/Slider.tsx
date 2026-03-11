import * as React from "react"
import { Theme } from "./Theme"

/** Props for the Slider component */
export interface SliderProps {
  /** Unique name identifier for this slider */
  name: string
  /** Minimum value */
  min: number
  /** Maximum value */
  max: number
  /** Step increment (default: 0.1) */
  step?: number
  /** Current value (controlled) */
  value: number
  /** Called when the value changes */
  onChange: (value: number) => void
  /** Optional display label */
  label?: string
  /** Whether to show the current numeric value (default: true) */
  showValue?: boolean
  /** Color for the slider track fill (default: Theme.indigo) */
  color?: string
}

/**
 * A parameter control slider rendered outside the SVG canvas.
 * Styled consistently with the Mafs design language.
 *
 * Must be placed as a sibling to `<Mafs>`, not inside it.
 */
export function Slider({
  name,
  min,
  max,
  step = 0.1,
  value,
  onChange,
  label,
  showValue = true,
  color = Theme.indigo,
}: SliderProps) {
  const id = `mafs-slider-${name}`
  const percent = ((value - min) / (max - min)) * 100

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value))
    },
    [onChange],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault()
        const coarseStep = step * 10
        const direction = e.key === "ArrowRight" ? 1 : -1
        const newValue = Math.min(max, Math.max(min, value + direction * coarseStep))
        onChange(parseFloat(newValue.toFixed(10)))
      }
    },
    [step, min, max, value, onChange],
  )

  return (
    <div className="mafs-slider" style={{ "--mafs-slider-color": color } as React.CSSProperties}>
      <div className="mafs-slider-header">
        {label && (
          <label className="mafs-slider-label" htmlFor={id}>
            {label}
          </label>
        )}
        {showValue && (
          <span className="mafs-slider-value" aria-live="polite">
            {name} = {Number.isInteger(value) ? value : value.toFixed(2)}
          </span>
        )}
      </div>
      <input
        id={id}
        className="mafs-slider-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label={label ?? name}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={
          {
            "--mafs-slider-percent": `${percent}%`,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

Slider.displayName = "Slider"
