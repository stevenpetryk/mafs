import { Expr, add, call, constValue, mul, num, pow, toString } from "./expr"

/**
 * Algebraic simplification: flattening, constant folding, collecting like
 * terms, and combining powers of the same base.
 *
 * Simplification is NOT domain-preserving: `x / x` becomes `1`, which forgets
 * the hole at x = 0. That's the standard CAS trade-off, and it's why
 * `analyze()` always works on the expression as written, never on the
 * simplified form.
 */
export function simplify(e: Expr): Expr {
  switch (e.kind) {
    case "num":
    case "var":
    case "const":
      return e
    case "add":
      return simplifyAdd(e.terms.map(simplify))
    case "mul":
      return simplifyMul(e.factors.map(simplify))
    case "pow":
      return simplifyPow(simplify(e.base), simplify(e.exp))
    case "call":
      return simplifyCall(e.fn, simplify(e.arg))
  }
}

const isNum = (e: Expr): e is { kind: "num"; value: number } => e.kind === "num"

/** Split `3 * x^2` into coefficient 3 and term `x^2`. */
function coefficientAndTerm(e: Expr): [number, Expr] {
  if (e.kind === "num") return [e.value, num(1)]
  if (e.kind === "mul") {
    const n = e.factors.find((f) => f.kind === "num")
    if (n && n.kind === "num") {
      const rest = e.factors.filter((f) => f !== n)
      return [n.value, rest.length === 1 ? rest[0] : mul(...rest)]
    }
  }
  return [1, e]
}

function simplifyAdd(terms: Expr[]): Expr {
  const flat: Expr[] = []
  for (const t of terms) {
    if (t.kind === "add") flat.push(...t.terms)
    else flat.push(t)
  }

  let constant = 0
  const collected = new Map<string, { coef: number; term: Expr }>()
  for (const t of flat) {
    if (t.kind === "num") {
      constant += t.value
      continue
    }
    const [coef, term] = coefficientAndTerm(t)
    const key = toString(term)
    const existing = collected.get(key)
    if (existing) existing.coef += coef
    else collected.set(key, { coef, term })
  }

  const out: Expr[] = []
  for (const { coef, term } of collected.values()) {
    if (coef === 0) continue
    out.push(coef === 1 ? term : simplifyMul([num(coef), term]))
  }
  out.sort(compareForAdd)
  if (constant !== 0) out.push(num(constant))

  if (out.length === 0) return num(0)
  if (out.length === 1) return out[0]
  return add(...out)
}

/** Polynomial-ish ordering: higher powers of the variable first. */
function degreeHint(e: Expr): number {
  const [, term] = coefficientAndTerm(e)
  if (term.kind === "var") return 1
  if (term.kind === "pow" && term.base.kind === "var" && term.exp.kind === "num")
    return term.exp.value
  if (term.kind === "mul") return term.factors.reduce((d, f) => d + degreeHint(f), 0)
  return 0.5
}

function compareForAdd(a: Expr, b: Expr): number {
  return degreeHint(b) - degreeHint(a) || toString(a).localeCompare(toString(b))
}

function simplifyMul(factors: Expr[]): Expr {
  const flat: Expr[] = []
  for (const f of factors) {
    if (f.kind === "mul") flat.push(...f.factors)
    else flat.push(f)
  }

  let coef = 1
  // Combine powers of identical bases: x * x^2 -> x^3
  const powers = new Map<string, { base: Expr; exps: Expr[] }>()
  for (const f of flat) {
    if (f.kind === "num") {
      coef *= f.value
      continue
    }
    const [base, exp] = f.kind === "pow" ? [f.base, f.exp] : [f, num(1)]
    const key = toString(base)
    const existing = powers.get(key)
    if (existing) existing.exps.push(exp)
    else powers.set(key, { base, exps: [exp] })
  }

  if (coef === 0) return num(0)

  const out: Expr[] = []
  for (const { base, exps } of powers.values()) {
    const p = simplifyPow(base, exps.length === 1 ? exps[0] : simplifyAdd(exps))
    if (p.kind === "num") coef *= p.value
    else if (p.kind === "mul") {
      for (const f of p.factors) {
        if (f.kind === "num") coef *= f.value
        else out.push(f)
      }
    } else out.push(p)
  }

  // Canonical order (so like terms collect), with denominators last for nicer printing.
  const rank = (e: Expr) =>
    isReciprocal(e) ? 2 : e.kind === "var" || (e.kind === "pow" && e.base.kind === "var") ? 0 : 1
  out.sort((a, b) => rank(a) - rank(b) || toString(a).localeCompare(toString(b)))

  if (out.length === 0) return num(coef)
  if (coef !== 1) out.unshift(num(coef))
  if (out.length === 1) return out[0]
  return mul(...out)
}

function isReciprocal(e: Expr) {
  return e.kind === "pow" && e.exp.kind === "num" && e.exp.value < 0
}

function simplifyPow(base: Expr, exp: Expr): Expr {
  const b = base.kind === "num" ? base.value : null
  const p = exp.kind === "num" ? exp.value : null
  if (p === 0) return num(1)
  if (p === 1) return base
  if (b === 1) return num(1)

  if (b !== null && p !== null) {
    const v = Math.pow(b, p)
    // Only fold when the result is exact, so 2^0.5 stays symbolic.
    if (Number.isInteger(v) || (Number.isInteger(p) && Number.isFinite(v))) {
      if (Number.isInteger(p) && p < 0 && !Number.isInteger(v)) {
        return pow(num(Math.pow(b, -p)), num(-1))
      }
      return num(v)
    }
  }

  // (a^b)^c -> a^(bc) is only valid in general for integer c.
  if (base.kind === "pow" && p !== null && Number.isInteger(p)) {
    return simplifyPow(base.base, simplifyMul([base.exp, exp]))
  }

  // (ab)^n -> a^n b^n for integer n
  if (base.kind === "mul" && p !== null && Number.isInteger(p)) {
    return simplifyMul(base.factors.map((f) => simplifyPow(f, exp)))
  }

  return pow(base, exp)
}

function simplifyCall(fn: Parameters<typeof call>[0], arg: Expr): Expr {
  if (isNum(arg)) {
    if (fn === "sin" && arg.value === 0) return num(0)
    if (fn === "cos" && arg.value === 0) return num(1)
    if (fn === "tan" && arg.value === 0) return num(0)
    if (fn === "exp" && arg.value === 0) return num(1)
    if (fn === "ln" && arg.value === 1) return num(0)
    if (fn === "abs") return num(Math.abs(arg.value))
    if (fn === "floor") return num(Math.floor(arg.value))
    if (fn === "ceil") return num(Math.ceil(arg.value))
    if (fn === "sign") return num(Math.sign(arg.value))
  }
  if (fn === "ln" && arg.kind === "const" && arg.name === "e") return num(1)
  if (fn === "ln" && arg.kind === "call" && arg.fn === "exp") return arg.arg
  if (fn === "ln" && arg.kind === "pow" && arg.base.kind === "const" && arg.base.name === "e")
    return arg.exp
  if (fn === "abs" && arg.kind === "call" && arg.fn === "abs") return arg
  return call(fn, arg)
}

/** Numeric value of an expression that doesn't depend on any variable. */
export function constantValue(e: Expr): number | null {
  switch (e.kind) {
    case "num":
      return e.value
    case "const":
      return constValue(e.name)
    case "var":
      return null
    default: {
      const s = simplify(e)
      if (s.kind === "num") return s.value
      if (s.kind === "const") return constValue(s.name)
      return null
    }
  }
}
