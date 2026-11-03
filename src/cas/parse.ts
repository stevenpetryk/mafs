import {
  Expr,
  FnName,
  FN_NAMES,
  add,
  call,
  constant,
  div,
  mul,
  neg,
  num,
  pow,
  sub,
  variable,
} from "./expr"

/**
 * Parse a math expression written the way people type it into a graphing
 * calculator, e.g. `sin(1/x)`, `2x^2 - 3x + 1`, `|x| / x`, `sin^2 x`.
 *
 * Supports: `+ - * / ^`, implicit multiplication (`2x`, `3(x+1)`, `x sin x`),
 * absolute value bars, function application with or without parentheses,
 * `sin^2(x)` meaning `(sin x)^2`, and the constants `pi` (or `π`) and `e`.
 */
export function parse(input: string): Expr {
  const tokens = tokenize(input)
  const parser = new Parser(tokens, input)
  const result = parser.parseExpression()
  parser.expectEnd()
  return result
}

export class ParseError extends Error {
  constructor(
    message: string,
    public readonly position: number,
  ) {
    super(message)
    this.name = "ParseError"
  }
}

type Token =
  | { type: "num"; value: number; pos: number }
  | { type: "ident"; name: string; pos: number }
  | { type: "op"; op: "+" | "-" | "*" | "/" | "^" | "(" | ")" | "|" | ","; pos: number }

const ALIASES: Record<string, FnName> = {
  arcsin: "asin",
  arccos: "acos",
  arctan: "atan",
  sgn: "sign",
}

const KNOWN_WORDS = [...FN_NAMES, ...Object.keys(ALIASES), "sqrt", "cbrt", "pi"]
  // Longest match first, so "sinh" wins over "sin".
  .sort((a, b) => b.length - a.length)

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < input.length) {
    const c = input[i]

    if (/\s/.test(c)) {
      i++
      continue
    }

    if (/[0-9.]/.test(c)) {
      const match = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(input.slice(i))
      if (!match) throw new ParseError(`Unexpected "${c}"`, i)
      // "2e" means 2 times e, not an exponent, unless digits follow.
      tokens.push({ type: "num", value: parseFloat(match[0]), pos: i })
      i += match[0].length
      continue
    }

    if (c === "π") {
      tokens.push({ type: "ident", name: "pi", pos: i })
      i++
      continue
    }

    if (/[a-zA-Z]/.test(c)) {
      // Split runs of letters into known words and single-letter variables,
      // so "xsinx" reads as x * sin(x) and "pix" as pi * x.
      let j = i
      while (j < input.length && /[a-zA-Z]/.test(input[j])) j++
      const word = input.slice(i, j)
      let k = 0
      while (k < word.length) {
        const rest = word.slice(k).toLowerCase()
        const known = KNOWN_WORDS.find((w) => rest.startsWith(w))
        const name = known ?? word[k]
        tokens.push({ type: "ident", name, pos: i + k })
        k += name.length
      }
      i = j
      continue
    }

    if ("+-*/^()|,".includes(c)) {
      tokens.push({ type: "op", op: c as "+", pos: i })
      i++
      continue
    }
    if (c === "−") {
      tokens.push({ type: "op", op: "-", pos: i })
      i++
      continue
    }
    if (c === "·" || c === "×") {
      tokens.push({ type: "op", op: "*", pos: i })
      i++
      continue
    }

    throw new ParseError(`Unexpected "${c}"`, i)
  }

  return tokens
}

function isFunctionName(name: string): boolean {
  return (
    (FN_NAMES as readonly string[]).includes(name) ||
    name in ALIASES ||
    name === "sqrt" ||
    name === "cbrt"
  )
}

function applyFunction(name: string, arg: Expr): Expr {
  if (name === "sqrt") return pow(arg, num(0.5))
  if (name === "cbrt") return pow(arg, div(num(1), num(3)))
  return call((ALIASES[name] ?? name) as FnName, arg)
}

class Parser {
  private i = 0
  private absDepth = 0

  constructor(
    private tokens: Token[],
    private input: string,
  ) {}

  private peek(): Token | undefined {
    return this.tokens[this.i]
  }

  private isOp(op: string, t = this.peek()): boolean {
    return t?.type === "op" && t.op === op
  }

  private expectOp(op: string) {
    const t = this.peek()
    if (!this.isOp(op, t)) {
      throw new ParseError(`Expected "${op}"`, t?.pos ?? this.input.length)
    }
    this.i++
  }

  expectEnd() {
    const t = this.peek()
    if (t) throw new ParseError(`Unexpected "${this.input.slice(t.pos, t.pos + 1)}"`, t.pos)
  }

  parseExpression(): Expr {
    let left = this.parseProduct()
    for (;;) {
      if (this.isOp("+")) {
        this.i++
        left = add(left, this.parseProduct())
      } else if (this.isOp("-")) {
        this.i++
        left = sub(left, this.parseProduct())
      } else return left
    }
  }

  /** Whether the next token can begin an implicitly-multiplied factor. */
  private startsImplicitFactor(): boolean {
    const t = this.peek()
    if (!t) return false
    if (t.type === "num" || t.type === "ident") return true
    if (this.isOp("(", t)) return true
    // An opening bar, but only when we're not waiting on a closing one.
    if (this.isOp("|", t)) return this.absDepth === 0
    return false
  }

  private parseProduct(): Expr {
    let left = this.parseUnary()
    for (;;) {
      if (this.isOp("*")) {
        this.i++
        left = mul(left, this.parseUnary())
      } else if (this.isOp("/")) {
        this.i++
        // Implicit multiplication binds tighter than division, like on most
        // calculators: 1/2x is 1/(2x), and 1/(x-1)(x+2) is 1/((x-1)(x+2)).
        let divisor = this.parseUnary()
        while (this.startsImplicitFactor()) divisor = mul(divisor, this.parsePower())
        left = div(left, divisor)
      } else if (this.startsImplicitFactor()) {
        left = mul(left, this.parsePower())
      } else return left
    }
  }

  private parseUnary(): Expr {
    if (this.isOp("-")) {
      this.i++
      return neg(this.parseUnary())
    }
    if (this.isOp("+")) {
      this.i++
      return this.parseUnary()
    }
    return this.parsePower()
  }

  private parsePower(): Expr {
    const base = this.parsePrimary()
    if (this.isOp("^")) {
      this.i++
      // Right-associative, and exponents may be negated: x^-2.
      return pow(base, this.parseUnary())
    }
    return base
  }

  private parsePrimary(): Expr {
    const t = this.peek()
    if (!t) throw new ParseError("Unexpected end of input", this.input.length)

    if (t.type === "num") {
      this.i++
      return num(t.value)
    }

    if (t.type === "ident") {
      this.i++
      if (t.name === "pi") return constant("pi")
      if (t.name === "e") return constant("e")
      if (isFunctionName(t.name)) return this.parseFunctionApplication(t.name)
      return variable(t.name)
    }

    if (this.isOp("(", t)) {
      this.i++
      const saved = this.absDepth
      this.absDepth = 0
      const inner = this.parseExpression()
      this.absDepth = saved
      this.expectOp(")")
      return inner
    }

    if (this.isOp("|", t)) {
      this.i++
      this.absDepth++
      const inner = this.parseExpression()
      this.absDepth--
      this.expectOp("|")
      return call("abs", inner)
    }

    throw new ParseError(`Unexpected "${this.input.slice(t.pos, t.pos + 1)}"`, t.pos)
  }

  private parseFunctionApplication(name: string): Expr {
    // sin^2(x) means (sin(x))^2
    let power: Expr | null = null
    if (this.isOp("^")) {
      this.i++
      power = this.parseUnary()
    }

    let arg: Expr
    if (this.isOp("(")) {
      this.i++
      const saved = this.absDepth
      this.absDepth = 0
      arg = this.parseExpression()
      this.absDepth = saved
      this.expectOp(")")
    } else {
      // "sin x^2" means sin(x^2); "sin 2x" means sin(2x).
      arg = this.parsePower()
      while (
        this.peek()?.type === "num" ||
        (this.peek()?.type === "ident" && !isFunctionName((this.peek() as { name: string }).name))
      ) {
        arg = mul(arg, this.parsePower())
      }
    }

    const applied = applyFunction(name, arg)
    return power ? pow(applied, power) : applied
  }
}
