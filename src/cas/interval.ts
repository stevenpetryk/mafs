import { Expr, FnName, constValue } from "./expr"
import { oddDenominator, realPow } from "./evaluate"

/**
 * Interval arithmetic. `[lo, hi]` is a guaranteed enclosure of every value
 * the expression takes when its variable ranges over the input interval
 * (ignoring floating point rounding, which is fine for drawing pixels).
 *
 * `null` means the expression is undefined everywhere on the input.
 *
 * The plotter uses this to draw functions that oscillate faster than a pixel
 * can show: instead of sampling sin(1/x) near 0 and getting aliasing garbage,
 * it shades the band the function is guaranteed to stay within.
 */
export type Interval = readonly [lo: number, hi: number] | null

const TAU = 2 * Math.PI
const ALL: Interval = [-Infinity, Infinity]

function hull(...xs: number[]): Interval {
  const finite = xs.filter((x) => !Number.isNaN(x))
  if (finite.length === 0) return null
  return [Math.min(...finite), Math.max(...finite)]
}

function iAdd(a: Interval, b: Interval): Interval {
  if (!a || !b) return null
  return [a[0] + b[0], a[1] + b[1]]
}

function safeMul(x: number, y: number) {
  // 0 * Infinity is 0 for enclosure purposes.
  return x === 0 || y === 0 ? 0 : x * y
}

function iMul(a: Interval, b: Interval): Interval {
  if (!a || !b) return null
  return hull(safeMul(a[0], b[0]), safeMul(a[0], b[1]), safeMul(a[1], b[0]), safeMul(a[1], b[1]))
}

function iRecip([lo, hi]: readonly [number, number]): Interval {
  if (lo > 0 || hi < 0) return [1 / hi, 1 / lo]
  if (lo === 0 && hi === 0) return null
  if (lo === 0) return [1 / hi, Infinity]
  if (hi === 0) return [-Infinity, 1 / lo]
  return ALL
}

function iPowInt(a: readonly [number, number], n: number): Interval {
  if (n === 0) return [1, 1]
  if (n < 0) {
    const p = iPowInt(a, -n)
    return p && iRecip(p)
  }
  const [lo, hi] = a
  if (n % 2 === 1) return [Math.pow(lo, n), Math.pow(hi, n)]
  if (lo >= 0) return [Math.pow(lo, n), Math.pow(hi, n)]
  if (hi <= 0) return [Math.pow(hi, n), Math.pow(lo, n)]
  return [0, Math.max(Math.pow(lo, n), Math.pow(hi, n))]
}

function iPow(a: Interval, b: Interval): Interval {
  if (!a || !b) return null
  if (b[0] === b[1]) {
    const p = b[0]
    if (Number.isInteger(p)) return iPowInt(a, p)
    const q = oddDenominator(p)
    if (q !== null) {
      // Odd root: monotone (for p>0) or monotone on each sign (p<0). Real everywhere.
      const f = (x: number) => realPow(x, p)
      if (p > 0) return hull(f(a[0]), f(a[1]), a[0] < 0 && a[1] > 0 ? 0 : NaN)
      if (a[0] > 0 || a[1] < 0) return hull(f(a[0]), f(a[1]))
      return ALL
    }
    // Even root / irrational exponent: only defined for x >= 0.
    const lo = Math.max(a[0], 0)
    if (a[1] < 0) return null
    if (p > 0) return [Math.pow(lo, p), Math.pow(a[1], p)]
    return [Math.pow(a[1], p), lo === 0 ? Infinity : Math.pow(lo, p)]
  }
  // Variable exponent: fall back to exp(b ln a) on the positive part.
  if (a[1] <= 0) return null
  const ln: Interval = [Math.log(Math.max(a[0], 0)), Math.log(a[1])]
  const prod = iMul(ln, b)
  return prod && [Math.exp(prod[0]), Math.exp(prod[1])]
}

/** Whether the interval contains any point of the form offset + k * period. */
function containsLattice([lo, hi]: readonly [number, number], offset: number, period: number) {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return true
  return Math.floor((hi - offset) / period) >= Math.ceil((lo - offset) / period)
}

function iSin(a: readonly [number, number]): Interval {
  if (a[1] - a[0] >= TAU) return [-1, 1]
  const lo = containsLattice(a, -Math.PI / 2, TAU) ? -1 : Math.min(Math.sin(a[0]), Math.sin(a[1]))
  const hi = containsLattice(a, Math.PI / 2, TAU) ? 1 : Math.max(Math.sin(a[0]), Math.sin(a[1]))
  return [lo, hi]
}

function iCos(a: readonly [number, number]): Interval {
  return iSin([a[0] + Math.PI / 2, a[1] + Math.PI / 2])
}

function iTan(a: readonly [number, number]): Interval {
  if (a[1] - a[0] >= Math.PI || containsLattice(a, Math.PI / 2, Math.PI)) return ALL
  return [Math.tan(a[0]), Math.tan(a[1])]
}

function monotone(
  f: (x: number) => number,
  a: readonly [number, number],
  dom?: [number, number],
): Interval {
  let [lo, hi] = a
  if (dom) {
    lo = Math.max(lo, dom[0])
    hi = Math.min(hi, dom[1])
    if (lo > hi) return null
  }
  return hull(f(lo), f(hi))
}

function iCall(fn: FnName, a: Interval): Interval {
  if (!a) return null
  switch (fn) {
    case "sin":
      return iSin(a)
    case "cos":
      return iCos(a)
    case "tan":
      return iTan(a)
    case "sec": {
      const c = iCos(a)
      return c && iRecip(c)
    }
    case "csc": {
      const s = iSin(a)
      return s && iRecip(s)
    }
    case "cot": {
      const t = iTan(a)
      return t && (t[0] === -Infinity ? ALL : iRecip(t))
    }
    case "asin":
      return monotone(Math.asin, a, [-1, 1])
    case "acos": {
      const r = monotone(Math.acos, a, [-1, 1])
      return r && [Math.min(r[0], r[1]), Math.max(r[0], r[1])]
    }
    case "atan":
      return monotone(Math.atan, a)
    case "sinh":
      return monotone(Math.sinh, a)
    case "tanh":
      return monotone(Math.tanh, a)
    case "cosh":
      return a[0] <= 0 && a[1] >= 0
        ? [1, Math.max(Math.cosh(a[0]), Math.cosh(a[1]))]
        : hull(Math.cosh(a[0]), Math.cosh(a[1]))
    case "exp":
      return monotone(Math.exp, a)
    case "ln":
      return monotone(Math.log, a, [0, Infinity])
    case "log":
      return monotone(Math.log10, a, [0, Infinity])
    case "abs":
      return a[0] <= 0 && a[1] >= 0
        ? [0, Math.max(-a[0], a[1])]
        : hull(Math.abs(a[0]), Math.abs(a[1]))
    case "floor":
      return [Math.floor(a[0]), Math.floor(a[1])]
    case "ceil":
      return [Math.ceil(a[0]), Math.ceil(a[1])]
    case "round":
      return [Math.round(a[0]), Math.round(a[1])]
    case "sign":
      return [Math.sign(a[0]), Math.sign(a[1])]
  }
}

/** Evaluate an expression over an interval of its variable. */
export function evaluateInterval(e: Expr, x: readonly [number, number], variable = "x"): Interval {
  switch (e.kind) {
    case "num":
      return [e.value, e.value]
    case "const": {
      const v = constValue(e.name)
      return [v, v]
    }
    case "var":
      return e.name === variable ? x : null
    case "add":
      return e.terms.reduce<Interval>(
        (acc, t) => iAdd(acc, evaluateInterval(t, x, variable)),
        [0, 0],
      )
    case "mul":
      return e.factors.reduce<Interval>(
        (acc, f) => iMul(acc, evaluateInterval(f, x, variable)),
        [1, 1],
      )
    case "pow":
      return iPow(evaluateInterval(e.base, x, variable), evaluateInterval(e.exp, x, variable))
    case "call":
      return iCall(e.fn, evaluateInterval(e.arg, x, variable))
  }
}
