/**
 * Expression tree for Mafs' small computer algebra system.
 *
 * The representation is deliberately minimal and canonical-ish, in the style
 * of most CAS kernels:
 *
 * - Subtraction is `a + (-1 * b)`.
 * - Division is `a * b^-1`.
 * - Every function takes exactly one argument.
 *
 * This keeps the number of node kinds small, which makes the analysis code
 * (finding poles, jumps, domain boundaries...) much easier to write: a
 * denominator is just a `pow` with a negative exponent.
 */

export type FnName =
  | "sin"
  | "cos"
  | "tan"
  | "sec"
  | "csc"
  | "cot"
  | "asin"
  | "acos"
  | "atan"
  | "sinh"
  | "cosh"
  | "tanh"
  | "exp"
  | "ln"
  | "log"
  | "abs"
  | "floor"
  | "ceil"
  | "round"
  | "sign"

export const FN_NAMES: readonly FnName[] = [
  "sin",
  "cos",
  "tan",
  "sec",
  "csc",
  "cot",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "exp",
  "ln",
  "log",
  "abs",
  "floor",
  "ceil",
  "round",
  "sign",
]

export type ConstName = "pi" | "e"

export type Expr =
  | { kind: "num"; value: number }
  | { kind: "var"; name: string }
  | { kind: "const"; name: ConstName }
  | { kind: "add"; terms: Expr[] }
  | { kind: "mul"; factors: Expr[] }
  | { kind: "pow"; base: Expr; exp: Expr }
  | { kind: "call"; fn: FnName; arg: Expr }

export const num = (value: number): Expr => ({ kind: "num", value })
export const variable = (name: string): Expr => ({ kind: "var", name })
export const constant = (name: ConstName): Expr => ({ kind: "const", name })
export const add = (...terms: Expr[]): Expr => ({ kind: "add", terms })
export const mul = (...factors: Expr[]): Expr => ({ kind: "mul", factors })
export const pow = (base: Expr, exp: Expr): Expr => ({ kind: "pow", base, exp })
export const call = (fn: FnName, arg: Expr): Expr => ({ kind: "call", fn, arg })
export const neg = (e: Expr): Expr => mul(num(-1), e)
export const sub = (a: Expr, b: Expr): Expr => add(a, neg(b))
export const div = (a: Expr, b: Expr): Expr => mul(a, pow(b, num(-1)))

export function constValue(name: ConstName): number {
  return name === "pi" ? Math.PI : Math.E
}

/** Visit every node in the tree, parents before children. */
export function walk(e: Expr, visit: (e: Expr) => void): void {
  visit(e)
  switch (e.kind) {
    case "add":
      e.terms.forEach((t) => walk(t, visit))
      break
    case "mul":
      e.factors.forEach((f) => walk(f, visit))
      break
    case "pow":
      walk(e.base, visit)
      walk(e.exp, visit)
      break
    case "call":
      walk(e.arg, visit)
      break
  }
}

/** Whether the expression mentions the variable `name`. */
export function dependsOn(e: Expr, name: string): boolean {
  let found = false
  walk(e, (n) => {
    if (n.kind === "var" && n.name === name) found = true
  })
  return found
}

export function equals(a: Expr, b: Expr): boolean {
  return toString(a) === toString(b)
}

// ---------------------------------------------------------------------------
// Printing
// ---------------------------------------------------------------------------

const PREC = { add: 1, mul: 2, neg: 3, pow: 4, atom: 5 }

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return String(n)
  // Prefer short, readable decimals.
  return String(Number(n.toPrecision(12)))
}

/** Split a product into numerator and denominator factors (for printing). */
function splitFraction(factors: Expr[]): { coef: number; numer: Expr[]; denom: Expr[] } {
  let coef = 1
  const numer: Expr[] = []
  const denom: Expr[] = []
  for (const f of factors) {
    if (f.kind === "num") coef *= f.value
    else if (f.kind === "pow" && f.exp.kind === "num" && f.exp.value < 0) {
      denom.push(f.exp.value === -1 ? f.base : pow(f.base, num(-f.exp.value)))
    } else numer.push(f)
  }
  return { coef, numer, denom }
}

function negativeCoefficient(e: Expr): boolean {
  if (e.kind === "num") return e.value < 0
  if (e.kind === "mul") return e.factors.some((f) => f.kind === "num" && f.value < 0)
  return false
}

export function toString(e: Expr): string {
  return print(e, 0)
}

function print(e: Expr, parentPrec: number): string {
  const wrap = (s: string, prec: number) => (prec < parentPrec ? `(${s})` : s)

  switch (e.kind) {
    case "num":
      return e.value < 0 ? wrap(formatNumber(e.value), PREC.neg) : formatNumber(e.value)
    case "var":
      return e.name
    case "const":
      return e.name
    case "add": {
      let s = ""
      e.terms.forEach((t, i) => {
        if (i > 0 && negativeCoefficient(t)) {
          s += " - " + print(negate(t), PREC.add + 1)
        } else {
          s += (i > 0 ? " + " : "") + print(t, PREC.add)
        }
      })
      return wrap(s, PREC.add)
    }
    case "mul": {
      const { coef, numer, denom } = splitFraction(e.factors)
      if (coef === -1 && (numer.length || denom.length)) {
        return wrap(
          "-" + print(mul(...numer, ...denom.map((d) => pow(d, num(-1)))), PREC.neg),
          PREC.neg,
        )
      }
      const numerParts = [...(coef !== 1 || numer.length === 0 ? [formatNumber(coef)] : [])]
      numer.forEach((f) => numerParts.push(print(f, PREC.mul + 1)))
      let s = numerParts.join(" * ")
      if (denom.length) {
        const d =
          denom.length === 1
            ? print(denom[0], PREC.pow)
            : `(${denom.map((f) => print(f, PREC.mul + 1)).join(" * ")})`
        s += " / " + d
      }
      return wrap(s, coef < 0 ? PREC.neg : PREC.mul)
    }
    case "pow":
      if (e.exp.kind === "num" && e.exp.value < 0) return print(mul(e), parentPrec)
      return wrap(`${print(e.base, PREC.pow + 1)}^${print(e.exp, PREC.atom)}`, PREC.pow)
    case "call":
      return `${e.fn}(${print(e.arg, 0)})`
  }
}

function negate(e: Expr): Expr {
  if (e.kind === "num") return num(-e.value)
  if (e.kind === "mul") {
    let done = false
    const factors = e.factors
      .map((f) => {
        if (!done && f.kind === "num") {
          done = true
          return num(-f.value)
        }
        return f
      })
      .filter((f) => !(f.kind === "num" && f.value === 1))
    if (factors.length === 0) return num(1)
    return factors.length === 1 ? factors[0] : mul(...factors)
  }
  return neg(e)
}

const TEX_FN: Partial<Record<FnName, string>> = {
  asin: "\\arcsin",
  acos: "\\arccos",
  atan: "\\arctan",
  floor: "",
  ceil: "",
  abs: "",
  round: "\\operatorname{round}",
  sign: "\\operatorname{sgn}",
}

/** Render an expression as TeX, suitable for Mafs' `<LaTeX>` component. */
export function toTex(e: Expr): string {
  return tex(e, 0)
}

function tex(e: Expr, parentPrec: number): string {
  const wrap = (s: string, prec: number) => (prec < parentPrec ? `\\left(${s}\\right)` : s)

  switch (e.kind) {
    case "num":
      return e.value < 0 ? wrap(formatNumber(e.value), PREC.neg) : formatNumber(e.value)
    case "var":
      return e.name
    case "const":
      return e.name === "pi" ? "\\pi" : "e"
    case "add": {
      let s = ""
      e.terms.forEach((t, i) => {
        if (i > 0 && negativeCoefficient(t)) s += " - " + tex(negate(t), PREC.add + 1)
        else s += (i > 0 ? " + " : "") + tex(t, PREC.add)
      })
      return wrap(s, PREC.add)
    }
    case "mul": {
      const { coef, numer, denom } = splitFraction(e.factors)
      const sign = coef < 0 ? "-" : ""
      const absCoef = Math.abs(coef)
      const top = [
        ...(absCoef !== 1 || numer.length === 0 ? [formatNumber(absCoef)] : []),
        ...numer.map((f) => tex(f, PREC.mul + 1)),
      ].join(" \\cdot ")
      if (denom.length) {
        const bottom =
          denom.length === 1
            ? tex(denom[0], 0)
            : denom.map((f) => tex(f, PREC.mul + 1)).join(" \\cdot ")
        return wrap(`${sign}\\frac{${top}}{${bottom}}`, sign ? PREC.neg : PREC.mul)
      }
      return wrap(sign + top, sign ? PREC.neg : PREC.mul)
    }
    case "pow": {
      if (e.exp.kind === "num" && e.exp.value === 0.5) return `\\sqrt{${tex(e.base, 0)}}`
      return wrap(`{${tex(e.base, PREC.pow + 1)}}^{${tex(e.exp, 0)}}`, PREC.pow)
    }
    case "call": {
      const inner = tex(e.arg, 0)
      if (e.fn === "abs") return `\\left|${inner}\\right|`
      if (e.fn === "floor") return `\\left\\lfloor ${inner}\\right\\rfloor`
      if (e.fn === "ceil") return `\\left\\lceil ${inner}\\right\\rceil`
      if (e.fn === "exp") return `e^{${inner}}`
      const name = TEX_FN[e.fn] ?? `\\${e.fn}`
      return `${name}\\left(${inner}\\right)`
    }
  }
}
