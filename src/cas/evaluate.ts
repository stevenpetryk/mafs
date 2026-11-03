import { Expr, FnName, constValue } from "./expr"

export type Scope = Record<string, number>

/**
 * Real power with the usual graphing-calculator semantics: odd roots of
 * negative numbers are real, so (-8)^(1/3) = -2 rather than NaN.
 */
export function realPow(b: number, p: number): number {
  if (b >= 0 || Number.isInteger(p)) return Math.pow(b, p)
  const q = oddDenominator(p)
  if (q === null) return NaN
  const r = Math.pow(-b, p)
  // p = n/q with q odd: sign follows the numerator's parity.
  return Math.round(p * q) % 2 === 0 ? r : -r
}

/** If p is (close to) n/q with q odd and small, return q. */
export function oddDenominator(p: number): number | null {
  for (let q = 3; q <= 15; q += 2) {
    const n = p * q
    if (Math.abs(n - Math.round(n)) < 1e-9) return q
  }
  return null
}

const SEC = (x: number) => 1 / Math.cos(x)
const CSC = (x: number) => 1 / Math.sin(x)
const COT = (x: number) => 1 / Math.tan(x)

export const REAL_FNS: Record<FnName, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sec: SEC,
  csc: CSC,
  cot: COT,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  exp: Math.exp,
  ln: (x) => (x < 0 ? NaN : Math.log(x)),
  log: (x) => (x < 0 ? NaN : Math.log10(x)),
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  // Math.round rounds -0.5 up to -0; mathematically we want half away from zero.
  round: (x) => Math.sign(x) * Math.round(Math.abs(x)),
  sign: (x) => (x === 0 ? 0 : Math.sign(x)),
}

/** Evaluate an expression at a point. */
export function evaluate(e: Expr, scope: Scope): number {
  return compile(e)(scope)
}

/**
 * Compile an expression into a fast closure. This is what the plotter calls
 * thousands of times per frame, so it avoids re-walking the tree.
 */
export function compile(e: Expr): (scope: Scope) => number {
  switch (e.kind) {
    case "num": {
      const v = e.value
      return () => v
    }
    case "const": {
      const v = constValue(e.name)
      return () => v
    }
    case "var": {
      const name = e.name
      return (s) => {
        const v = s[name]
        return v === undefined ? NaN : v
      }
    }
    case "add": {
      const fs = e.terms.map(compile)
      return (s) => {
        let r = 0
        for (let i = 0; i < fs.length; i++) r += fs[i](s)
        return r
      }
    }
    case "mul": {
      const fs = e.factors.map(compile)
      return (s) => {
        let r = 1
        for (let i = 0; i < fs.length; i++) r *= fs[i](s)
        return r
      }
    }
    case "pow": {
      const b = compile(e.base)
      const p = compile(e.exp)
      return (s) => realPow(b(s), p(s))
    }
    case "call": {
      const f = REAL_FNS[e.fn]
      const a = compile(e.arg)
      return (s) => f(a(s))
    }
  }
}

/** Compile a one-variable expression into `(x) => number`. */
export function compile1(e: Expr, variable = "x"): (x: number) => number {
  const f = compile(e)
  const scope: Scope = {}
  return (x) => {
    scope[variable] = x
    return f(scope)
  }
}
