import { compile, EvalFunction } from "mathjs"

/**
 * Substitutes `{paramName}` templates in an expression string
 * with values from a parameter map.
 */
export function substituteParams(expression: string, params: Record<string, number>): string {
  return expression.replace(/\{(\w+)\}/g, (_, key) => {
    const value = params[key]
    if (value === undefined) return "0"
    // Wrap negative values in parens to avoid parse issues like 3*-2
    return value < 0 ? `(${value})` : String(value)
  })
}

/**
 * Compiles a math expression string into a function of x.
 * Uses mathjs for safe evaluation (no eval()).
 *
 * Supports standard math: +, -, *, /, ^, sin, cos, tan, sqrt, abs, log, exp, pi, e
 *
 * @param expression - A math expression string, e.g. "2*x^2 + sin(x)"
 * @returns A function that takes x and returns a number
 */
export function compileExpression(expression: string): (x: number) => number {
  let compiled: EvalFunction
  try {
    compiled = compile(expression)
  } catch {
    // Return NaN-producing function for unparseable expressions
    return () => NaN
  }

  return (x: number) => {
    try {
      const result = compiled.evaluate({ x })
      return typeof result === "number" ? result : NaN
    } catch {
      return NaN
    }
  }
}

/**
 * Substitutes parameters and compiles in one step.
 * Convenience wrapper for the JSON renderer's slider linking.
 *
 * @param expression - Expression with parameter templates, e.g. "\{a\}*(x-\{h\})^2"
 * @param params - Current parameter values, e.g. \{ a: 2, h: 1 \}
 * @returns A function that takes x and returns a number
 */
export function compileWithParams(
  expression: string,
  params: Record<string, number>,
): (x: number) => number {
  const substituted = substituteParams(expression, params)
  return compileExpression(substituted)
}

/**
 * Evaluates a numeric expression (no x variable) with parameter substitution.
 * Used for evaluating point positions, slider defaults, etc.
 *
 * @param expression - Expression or number string, e.g. "\{a\} + 2" or "3.5"
 * @param params - Current parameter values
 * @returns The numeric result, or NaN on failure
 */
export function evaluateNumeric(expression: string | number, params: Record<string, number>): number {
  if (typeof expression === "number") return expression

  const substituted = substituteParams(expression, params)
  try {
    const compiled = compile(substituted)
    const result = compiled.evaluate({})
    return typeof result === "number" ? result : NaN
  } catch {
    return NaN
  }
}
