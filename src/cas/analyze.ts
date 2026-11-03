import { Expr, walk, dependsOn } from "./expr"
import { compile1 } from "./evaluate"
import { constantValue } from "./simplify"

/**
 * How a function behaves as x approaches a point from one side.
 *
 * - `finite`: converges to `limit`
 * - `infinite`: blows up toward `sign * Infinity`
 * - `oscillating`: no limit; bounces around within [lo, hi] (e.g. sin(1/x) at 0)
 * - `undefined`: not real-valued on that side (e.g. ln(x) left of 0)
 */
export type OneSidedBehavior =
  | { type: "finite"; limit: number }
  | { type: "infinite"; sign: 1 | -1 }
  | { type: "oscillating"; lo: number; hi: number }
  | { type: "undefined" }

export type FeatureKind =
  /** Vertical asymptote, like 1/x at 0. */
  | "pole"
  /** Finite jump, like floor(x) at integers. */
  | "jump"
  /** A hole: both sides agree but the point itself is missing or different, like sin(x)/x at 0. */
  | "removable"
  /** No limit at all, like sin(1/x) at 0. */
  | "essential"
  /** Edge of the domain, like sqrt(x) at 0. */
  | "boundary"
  /** Continuous but not differentiable, like |x| at 0. */
  | "kink"

export interface Feature {
  x: number
  kind: FeatureKind
  left: OneSidedBehavior
  right: OneSidedBehavior
  /** The function's value exactly at x (NaN if undefined there). */
  value: number
}

export type Asymptote =
  | { type: "horizontal"; side: 1 | -1; y: number }
  | { type: "oblique"; side: 1 | -1; slope: number; intercept: number }

export interface Analysis {
  /** Discontinuities and other interesting points in the interval, sorted by x. */
  features: Feature[]
  /** Behavior as x goes to +/- infinity. */
  asymptotes: Asymptote[]
}

export interface AnalyzeOptions {
  variable?: string
  /** How many evenly spaced samples to take when hunting for roots. */
  resolution?: number
}

/**
 * Find the discontinuities, asymptotes, domain boundaries and other
 * trouble spots of a one-variable expression over an interval.
 *
 * This works symbolically first: it walks the expression tree looking for
 * every construct that *could* misbehave (denominators, logs, roots, tan,
 * floor, ...) and solves for where it does (e.g. where a denominator is zero).
 * Each candidate is then classified numerically by probing one-sided limits.
 */
export function analyze(
  expr: Expr,
  [a, b]: [number, number],
  options: AnalyzeOptions = {},
): Analysis {
  const variable = options.variable ?? "x"
  const resolution = options.resolution ?? 1024
  const f = compile1(expr, variable)

  const candidates = findCandidates(expr, [a, b], variable, resolution)
  const width = b - a
  const features: Feature[] = []
  for (const { x, reason, undefinedAt } of candidates) {
    const feature = classify(f, x, width, reason, undefinedAt)
    if (feature) features.push(feature)
  }

  return { features, asymptotes: findAsymptotes(f) }
}

// ---------------------------------------------------------------------------
// Candidate generation (symbolic)
// ---------------------------------------------------------------------------

type Reason = "singular" | "step" | "kink"

interface Candidate {
  x: number
  reason: Reason
  /**
   * The expression is undefined exactly at x in exact arithmetic (a zero
   * denominator, ln(0), tan at a pole...), even if floating point evaluation
   * at the nearest double happens to produce a finite number. Without this,
   * a hole like (x^2 - a^2)/(x - a) at an irrational a goes unnoticed.
   */
  undefinedAt: boolean
}

/** A set of target values: either finitely many, or a lattice offset + k * period. */
type Levels = { values: number[] } | { offset: number; period: number }

const MAX_CANDIDATES = 5000

function findCandidates(
  expr: Expr,
  [a, b]: [number, number],
  variable: string,
  resolution: number,
): Candidate[] {
  const out: Candidate[] = []
  const solve = (
    u: Expr,
    levels: Levels,
    reason: Reason,
    touching = false,
    undefinedAt = false,
  ) => {
    if (!dependsOn(u, variable)) return
    for (const x of solveLevels(u, levels, [a, b], variable, resolution, touching)) {
      out.push({ x, reason, undefinedAt })
    }
  }

  walk(expr, (node) => {
    if (node.kind === "pow") {
      const p = constantValue(node.exp)
      if (p === null || p < 0 || !Number.isInteger(p)) {
        // Zeros of a denominator, or the edge of a root's domain.
        solve(node.base, { values: [0] }, "singular", true, p === null || p < 0)
      }
    } else if (node.kind === "call") {
      const u = node.arg
      switch (node.fn) {
        case "tan":
        case "sec":
          solve(u, { offset: Math.PI / 2, period: Math.PI }, "singular", false, true)
          break
        case "cot":
        case "csc":
          solve(u, { offset: 0, period: Math.PI }, "singular", false, true)
          break
        case "ln":
        case "log":
          solve(u, { values: [0] }, "singular", true, true)
          break
        case "asin":
        case "acos":
          solve(u, { values: [-1, 1] }, "singular", true)
          break
        case "floor":
        case "ceil":
          solve(u, { offset: 0, period: 1 }, "step")
          break
        case "round":
          solve(u, { offset: 0.5, period: 1 }, "step")
          break
        case "sign":
          solve(u, { values: [0] }, "step", true)
          break
        case "abs":
          solve(u, { values: [0] }, "kink", true)
          break
      }
    }
  })

  // Merge duplicates (the same point found via several subexpressions).
  out.sort((p, q) => p.x - q.x)
  const tol = (b - a) * 1e-9
  const merged: Candidate[] = []
  const rank: Record<Reason, number> = { singular: 2, step: 1, kink: 0 }
  for (const c of out) {
    const last = merged[merged.length - 1]
    if (last && c.x - last.x <= tol) {
      if (rank[c.reason] > rank[last.reason]) last.reason = c.reason
      last.undefinedAt ||= c.undefinedAt
    } else merged.push({ ...c })
    if (merged.length >= MAX_CANDIDATES) break
  }
  return merged
}

/**
 * Find every x in [a, b] where u(x) hits one of the target levels.
 *
 * Bracketing + bisection catches sign changes. With `touching`, it also looks
 * for roots that touch zero without crossing it (like x^2 at 0), which are
 * exactly the double poles in things like 1/x^2.
 */
function solveLevels(
  u: Expr,
  levels: Levels,
  [a, b]: [number, number],
  variable: string,
  n: number,
  touching: boolean,
): number[] {
  const g = compile1(u, variable)
  const xs: number[] = []
  const us: number[] = []
  for (let i = 0; i <= n; i++) {
    // Nudge the grid off of "nice" numbers by an irrational-ish fraction, but
    // keep the endpoints exact.
    const x = i === 0 ? a : i === n ? b : a + ((b - a) * (i + 0.0123456789 * Math.sin(i))) / n
    xs.push(x)
    us.push(g(x))
  }

  const roots: number[] = []
  const tol = (b - a) * 1e-14

  const levelsBetween = (u0: number, u1: number): number[] => {
    const lo = Math.min(u0, u1)
    const hi = Math.max(u0, u1)
    if ("values" in levels) return levels.values.filter((c) => c >= lo && c <= hi)
    const kMin = Math.ceil((lo - levels.offset) / levels.period)
    const kMax = Math.floor((hi - levels.offset) / levels.period)
    // Too many crossings between two samples means u oscillates faster than we
    // can resolve here (like 1/x near 0). The interval renderer handles that.
    if (kMax - kMin > 8) return []
    const out = []
    for (let k = kMin; k <= kMax; k++) out.push(levels.offset + k * levels.period)
    return out
  }

  const verify = (x: number, c: number) => {
    const v = g(x)
    // Reject "roots" that are really u jumping over c (e.g. 1/x across 0).
    return Number.isFinite(v) && Math.abs(v - c) <= 1e-6 * (1 + Math.abs(c))
  }

  for (let i = 0; i < n; i++) {
    const u0 = us[i]
    const u1 = us[i + 1]
    if (!Number.isFinite(u0) || !Number.isFinite(u1)) {
      // u is undefined on part of this gap: the edge of u's domain is itself a
      // candidate, since anything built on u will start or stop there.
      if (Number.isFinite(u0) !== Number.isFinite(u1)) {
        roots.push(bisectBoundary(g, xs[i], xs[i + 1], Number.isFinite(u0)))
      }
      continue
    }
    for (const c of levelsBetween(u0, u1)) {
      if (u0 === c) {
        roots.push(xs[i])
        continue
      }
      if (u1 === c) continue // picked up as the next gap's u0
      const x = bisect((x) => g(x) - c, xs[i], xs[i + 1], u0 - c)
      if (verify(x, c)) roots.push(x)
    }
  }
  if (us[n] !== undefined && "values" in levels && levels.values.includes(us[n])) roots.push(xs[n])

  if (touching && "values" in levels) {
    for (const c of levels.values) {
      for (let i = 1; i < n; i++) {
        const d0 = Math.abs(us[i - 1] - c)
        const d1 = Math.abs(us[i] - c)
        const d2 = Math.abs(us[i + 1] - c)
        const sameSide =
          Math.sign(us[i - 1] - c) === Math.sign(us[i] - c) &&
          Math.sign(us[i] - c) === Math.sign(us[i + 1] - c)
        if (sameSide && d1 <= d0 && d1 <= d2) {
          const x = minimize((x) => Math.abs(g(x) - c), xs[i - 1], xs[i + 1])
          const scale = Math.max(d0, d2, 1e-300)
          if (Math.abs(g(x) - c) <= 1e-8 * scale && verify(x, c)) roots.push(x)
        }
      }
    }
  }

  return roots
    .map((x) => snapToNiceNumber(x, g, levels, b - a))
    .filter((x) => x >= a - tol && x <= b + tol)
}

/**
 * Bisection lands within an ulp or so of a root, e.g. 1e-17 instead of 0.
 * That matters: sin(x)/x is perfectly finite at 1e-17, so the hole at 0 would
 * go unnoticed. If a "nice" number (small fraction, or fraction of pi) is
 * right next to the root and is at least as good a root, use it instead.
 */
function snapToNiceNumber(
  x: number,
  g: (x: number) => number,
  levels: Levels,
  width: number,
): number {
  const tol = Math.max(width * 1e-9, 1e-12)
  const err = (t: number) => {
    const v = g(t)
    if (!Number.isFinite(v)) return Infinity
    if ("values" in levels) return Math.min(...levels.values.map((c) => Math.abs(v - c)))
    const k = Math.round((v - levels.offset) / levels.period)
    return Math.abs(v - (levels.offset + k * levels.period))
  }
  const base = err(x)
  for (const unit of [1, Math.PI]) {
    for (let d = 1; d <= 12; d++) {
      const nice = (Math.round((x / unit) * d) / d) * unit
      if (Math.abs(nice - x) <= tol && err(nice) <= base + 1e-12) return nice + 0 // no -0
    }
  }
  return x
}

function bisect(h: (x: number) => number, lo: number, hi: number, hLo: number): number {
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2
    if (mid === lo || mid === hi) break
    const hMid = h(mid)
    if (hMid === 0) return mid
    if (Math.sign(hMid) === Math.sign(hLo)) {
      lo = mid
      hLo = hMid
    } else hi = mid
  }
  return (lo + hi) / 2
}

/** Find where a function stops being finite between lo and hi. */
function bisectBoundary(
  g: (x: number) => number,
  lo: number,
  hi: number,
  finiteAtLo: boolean,
): number {
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2
    if (mid === lo || mid === hi) break
    if (Number.isFinite(g(mid)) === finiteAtLo) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/** Golden-section search for a local minimum. */
function minimize(h: (x: number) => number, lo: number, hi: number): number {
  const phi = (Math.sqrt(5) - 1) / 2
  let x1 = hi - phi * (hi - lo)
  let x2 = lo + phi * (hi - lo)
  let h1 = h(x1)
  let h2 = h(x2)
  for (let i = 0; i < 120 && hi - lo > 0; i++) {
    if (h1 < h2) {
      hi = x2
      x2 = x1
      h2 = h1
      x1 = hi - phi * (hi - lo)
      h1 = h(x1)
    } else {
      lo = x1
      x1 = x2
      h1 = h2
      x2 = lo + phi * (hi - lo)
      h2 = h(x2)
    }
  }
  return (lo + hi) / 2
}

// ---------------------------------------------------------------------------
// Classification (numeric limits)
// ---------------------------------------------------------------------------

/**
 * Estimate the limit of a sequence of samples taken at geometrically
 * shrinking distances from a point.
 */
function limitOfSequence(values: number[]): OneSidedBehavior {
  const finite = values.filter(Number.isFinite)
  // Mostly undefined (NaN) on this side.
  if (finite.length < values.length / 2) {
    const tail = values.slice(-6)
    if (tail.every((v) => v === Infinity)) return { type: "infinite", sign: 1 }
    if (tail.every((v) => v === -Infinity)) return { type: "infinite", sign: -1 }
    return { type: "undefined" }
  }

  const tail = values.slice(-8)
  if (!tail.every(Number.isFinite)) {
    const last = tail[tail.length - 1]
    if (last === Infinity || last === -Infinity)
      return { type: "infinite", sign: last > 0 ? 1 : -1 }
    return { type: "undefined" }
  }

  const last = tail[tail.length - 1]
  const spread = Math.max(...tail) - Math.min(...tail)

  // Settled down: the last several samples agree.
  if (spread <= 1e-7 * (1 + Math.abs(last))) return { type: "finite", limit: last }

  // Settled down earlier, before rounding noise took over at tiny h (e.g.
  // cancellation in (x^2 - a^2)/(x - a) right next to a). Any run of samples
  // that agrees this closely can't be oscillation or blow-up.
  // Use the tightest such run, where truncation and rounding error balance.
  let best: { spread: number; v: number } | null = null
  for (let i = 0; i + 8 <= values.length; i++) {
    const window = values.slice(i, i + 8)
    if (!window.every(Number.isFinite)) continue
    const spread = Math.max(...window) - Math.min(...window)
    const v = window[window.length - 1]
    if (spread <= 1e-6 * (1 + Math.abs(v)) && (!best || spread < best.spread)) best = { spread, v }
  }
  if (best) return { type: "finite", limit: best.v }

  // Converging geometrically (e.g. sqrt(h) or h^(1/3)): extrapolate the tail.
  const diffs = tail.slice(1).map((v, i) => v - tail[i])
  const ratios = diffs.slice(1).map((d, i) => d / diffs[i])
  if (ratios.every((r) => r > 0 && r < 0.97)) {
    const r = ratios[ratios.length - 1]
    const d = diffs[diffs.length - 1]
    return { type: "finite", limit: last + (d * r) / (1 - r) }
  }

  // Growing without bound in a consistent direction (1/x, ln x, ...).
  const growing = diffs.every((d) => Math.sign(d) === Math.sign(diffs[0]) && d !== 0)
  if (growing && ratios.every((r) => r >= 0.97)) {
    return { type: "infinite", sign: diffs[0] > 0 ? 1 : -1 }
  }

  return { type: "oscillating", lo: Math.min(...tail), hi: Math.max(...tail) }
}

function oneSided(
  f: (x: number) => number,
  p: number,
  width: number,
  dir: 1 | -1,
): OneSidedBehavior {
  const values: number[] = []
  const hMin = Math.max(width * 1e-13, Math.abs(p) * 4e-15)
  for (let h = width * 2 ** -8; h >= hMin; h /= 2) values.push(f(p + dir * h))
  return limitOfSequence(values)
}

function cleanLimit(b: OneSidedBehavior): OneSidedBehavior {
  if (b.type !== "finite") return b
  const r = Math.round(b.limit)
  return Math.abs(b.limit - r) <= 1e-9 * (1 + Math.abs(r)) ? { type: "finite", limit: r } : b
}

function sameLimit(a: number, b: number) {
  return Math.abs(a - b) <= 1e-6 * (1 + Math.abs(a) + Math.abs(b))
}

function classify(
  f: (x: number) => number,
  x: number,
  width: number,
  reason: Reason,
  undefinedAt: boolean,
): Feature | null {
  const left = cleanLimit(oneSided(f, x, width, -1))
  const right = cleanLimit(oneSided(f, x, width, 1))
  const value = undefinedAt ? NaN : f(x)
  const feature = (kind: FeatureKind): Feature => ({ x, kind, left, right, value })

  if (left.type === "infinite" || right.type === "infinite") return feature("pole")
  if (left.type === "oscillating" || right.type === "oscillating") return feature("essential")
  if (left.type === "undefined" && right.type === "undefined") return null
  if (left.type === "undefined" || right.type === "undefined") return feature("boundary")

  // Both sides finite.
  const L = (left as { limit: number }).limit
  const R = (right as { limit: number }).limit
  if (!sameLimit(L, R)) return feature("jump")
  if (!Number.isFinite(value) || !sameLimit(value, L)) return feature("removable")
  if (reason === "kink" || reason === "singular") {
    // Continuous here. Still worth reporting if it's a corner or a cusp.
    return isKink(f, x, width) ? feature("kink") : null
  }
  return null
}

function isKink(f: (x: number) => number, x: number, width: number): boolean {
  const h = width * 1e-6
  const v = f(x)
  const dl = (v - f(x - h)) / h
  const dr = (f(x + h) - v) / h
  if (!Number.isFinite(dl) || !Number.isFinite(dr)) return true
  return !sameLimit(dl, dr) && Math.abs(dl - dr) > 1e-3 * (1 + Math.abs(dl) + Math.abs(dr))
}

// ---------------------------------------------------------------------------
// Asymptotes at infinity
// ---------------------------------------------------------------------------

function findAsymptotes(f: (x: number) => number): Asymptote[] {
  const out: Asymptote[] = []
  for (const side of [-1, 1] as const) {
    const xs: number[] = []
    for (let k = 8; k <= 30; k++) xs.push(side * 2 ** k)

    const atInf = limitOfSequence(xs.map(f))
    if (atInf.type === "finite") {
      out.push({ type: "horizontal", side, y: cleanNumber(atInf.limit) })
      continue
    }
    if (atInf.type !== "infinite") continue

    const slope = limitOfSequence(xs.map((x) => f(x) / x))
    if (slope.type !== "finite" || slope.limit === 0) continue
    const m = cleanNumber(slope.limit)
    const intercept = limitOfSequence(xs.map((x) => f(x) - m * x))
    if (intercept.type !== "finite") continue
    out.push({ type: "oblique", side, slope: m, intercept: cleanNumber(intercept.limit) })
  }
  return out
}

/** Snap numerically-estimated limits like 0.9999999997 to 1. */
function cleanNumber(v: number): number {
  const r = Math.round(v)
  if (Math.abs(v - r) < 1e-6) return r
  const r4 = Math.round(v * 1e4) / 1e4
  if (Math.abs(v - r4) < 1e-9) return r4
  return v
}
