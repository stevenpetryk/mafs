import { Expr, add, call, mul, neg, num, pow, dependsOn, div } from "./expr"
import { simplify } from "./simplify"

/** Symbolic derivative of `e` with respect to `x`, simplified. */
export function diff(e: Expr, x = "x"): Expr {
  return simplify(d(e, x))
}

function d(e: Expr, x: string): Expr {
  if (!dependsOn(e, x)) return num(0)

  switch (e.kind) {
    case "num":
    case "const":
      return num(0)
    case "var":
      return num(e.name === x ? 1 : 0)
    case "add":
      return add(...e.terms.map((t) => d(t, x)))
    case "mul": {
      // Product rule, generalized to n factors.
      const terms = e.factors.map((_, i) =>
        mul(...e.factors.map((f, j) => (i === j ? d(f, x) : f))),
      )
      return add(...terms)
    }
    case "pow": {
      const { base, exp } = e
      if (!dependsOn(exp, x)) {
        // Power rule: (u^n)' = n u^(n-1) u'
        return mul(exp, pow(base, add(exp, num(-1))), d(base, x))
      }
      // General case: (u^v)' = u^v (v' ln u + v u'/u)
      return mul(e, add(mul(d(exp, x), call("ln", base)), mul(exp, d(base, x), pow(base, num(-1)))))
    }
    case "call": {
      const u = e.arg
      const du = d(u, x)
      return mul(outerDerivative(e.fn, u), du)
    }
  }
}

function outerDerivative(fn: Extract<Expr, { kind: "call" }>["fn"], u: Expr): Expr {
  switch (fn) {
    case "sin":
      return call("cos", u)
    case "cos":
      return neg(call("sin", u))
    case "tan":
      return pow(call("sec", u), num(2))
    case "sec":
      return mul(call("sec", u), call("tan", u))
    case "csc":
      return neg(mul(call("csc", u), call("cot", u)))
    case "cot":
      return neg(pow(call("csc", u), num(2)))
    case "asin":
      return pow(add(num(1), neg(pow(u, num(2)))), num(-0.5))
    case "acos":
      return neg(pow(add(num(1), neg(pow(u, num(2)))), num(-0.5)))
    case "atan":
      return pow(add(num(1), pow(u, num(2))), num(-1))
    case "sinh":
      return call("cosh", u)
    case "cosh":
      return call("sinh", u)
    case "tanh":
      return add(num(1), neg(pow(call("tanh", u), num(2))))
    case "exp":
      return call("exp", u)
    case "ln":
      return pow(u, num(-1))
    case "log":
      return div(num(1), mul(u, call("ln", num(10))))
    case "abs":
      return call("sign", u)
    // Piecewise constant: derivative is zero wherever it exists.
    case "floor":
    case "ceil":
    case "round":
    case "sign":
      return num(0)
  }
}
