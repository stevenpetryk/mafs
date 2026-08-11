import { vec } from "../../vec"

interface SampleParams<P> {
  /** The function to sample */
  fn: (t: number) => P
  /** A function that computes the error between a real sample function output and a midpoint output */
  error: (real: P, estimate: P) => number
  /** A function that computes the lerp of two sample function outputs, for purpose of comparing to the function's real output */
  lerp: (p1: P, p2: P, t: number) => P
  /** A function that is called whenever a point should be part of the sample */
  onPoint: (t: number, p: P) => void
  /** The domain to sample */
  domain: [min: number, max: number]
  /** The minimum recursion depth */
  minDepth: number
  /** The maximum recursion depth */
  maxDepth: number
  /** The maximium tolerated error returned by the error function */
  threshold: number
}

/**
 * Cheap psuedo-random hash function to consistently generate randomness when
 * sampling functions. This return a value between 0.4 and 0.6.
 */
function cheapHash(min: number, max: number) {
  const result = Math.sin(min * 12.9898 + max * 78.233) * 43758.5453
  return 0.4 + 0.2 * (result - Math.floor(result))
}

/**
 * A relatively generic internal function which, given a function, domain, and
 * an error function, will recursively subdivide the domain until sampling said
 * function at each point in the domain yields an error less than the supplied
 * threshold. Importantly, this makes no assumptions about the return type of
 * the sampled function.
 */
export function sample<SampledReturnType>({
  domain,
  minDepth,
  maxDepth,
  threshold,
  fn,
  error,
  onPoint,
  lerp,
}: SampleParams<SampledReturnType>) {
  const [min, max] = domain

  function subdivide(
    min: number,
    max: number,
    depth: number,
    pMin: SampledReturnType,
    pMax: SampledReturnType,
  ) {
    const t = cheapHash(min, max)
    const mid = min + (max - min) * t
    const pMid = fn(mid)

    function deepen() {
      subdivide(min, mid, depth + 1, pMin, pMid)
      onPoint(mid, pMid)
      subdivide(mid, max, depth + 1, pMid, pMax)
    }

    if (depth < minDepth) {
      deepen()
    } else if (depth < maxDepth) {
      const fnMidpoint = lerp(pMin, pMax, t)
      const e = error(pMid, fnMidpoint)
      if (e > threshold) deepen()
    }
  }

  onPoint(min, fn(min))
  subdivide(min, max, 0, fn(min), fn(max))
  onPoint(max, fn(max))
}

export function sampleParametric(
  fn: (t: number) => vec.Vector2,
  domain: vec.Vector2,
  minDepth: number,
  maxDepth: number,
  threshold: number,
  exclusions: number[] = [],
) {
  let needsMove = true
  let lastT: number | null = null

  const sortedExclusions = [...exclusions].sort((a, b) => a - b)

  // Returns true if any exclusion point lies strictly between `from` and `to`
  // (exclusive of `from`, inclusive of `to`), assuming `from < to`.
  function crossesExclusion(from: number, to: number): boolean {
    for (const e of sortedExclusions) {
      if (e > from && e <= to) return true
      if (e > to) break
    }
    return false
  }

  // Accumulate path segments in an array and join once at the end, which is
  // much faster than repeated string concatenation for dense samples.
  const parts: string[] = []

  sample({
    fn,
    error: (a, b) => vec.squareDist(a, b),
    onPoint: (t, [x, y]) => {
      if (Number.isFinite(x) && Number.isFinite(y)) {
        const breakPath = needsMove || (lastT !== null && crossesExclusion(lastT, t))
        parts.push(breakPath ? `M ${x} ${y}` : `L ${x} ${y}`)
        needsMove = false
        lastT = t
      } else {
        // A non-finite point breaks the curve; the next finite point starts a
        // new subpath so that discontinuities aren't connected with a line.
        needsMove = true
      }
    },
    lerp: (p1, p2, t) => vec.lerp(p1, p2, t),
    domain,
    minDepth,
    maxDepth,
    threshold,
  })

  return parts.join(" ")
}

export function sampleInequality(
  rangeAxis: "x" | "y",
  upper: (t: number) => number,
  lower: (t: number) => number,
  domain: vec.Vector2,
  minDepth: number,
  maxDepth: number,
  threshold: number,
) {
  const result = { fill: "", upper: "", lower: "" }

  let upperTmp = ""
  let lowerTmp = ""
  let ineqFalse = false

  let prevX = 0
  let prevUpper = 0
  let prevLower = 0

  function pointToString(x: number, y: number) {
    return rangeAxis === "x" ? `${x} ${y}` : `${y} ${x}`
  }

  sample<[vec.Vector2, vec.Vector2]>({
    domain,
    minDepth,
    maxDepth,
    threshold,
    fn: (x) => [
      [x, lower(x)],
      [x, upper(x)],
    ],
    error: ([realLower, realUpper], [estLower, estUpper]) => {
      return Math.max(vec.squareDist(realLower, estLower), vec.squareDist(realUpper, estUpper))
    },
    lerp: ([aLower, aUpper], [bLower, bUpper], t) => {
      return [vec.lerp(aLower, bLower, t), vec.lerp(aUpper, bUpper, t)]
    },
    onPoint: (x, [[, lower], [, upper]]) => {
      // TODO: these inequality operators should reflect the props, perhaps
      // the inequality operator itself should be a function passed into this
      const pathsJustCrossed = upper < lower && !ineqFalse
      const pathsJustUncrossed = upper > lower && ineqFalse

      if (pathsJustCrossed) {
        ineqFalse = true

        if (upperTmp && lowerTmp) {
          const midX = (prevX + x) / 2
          const midUpper = (prevUpper + upper) / 2
          const midLower = (prevLower + lower) / 2
          const midY = (midUpper + midLower) / 2
          upperTmp += ` ${pointToString(midX, midY)} L `
          lowerTmp = ` ${pointToString(midX, midY)} L ` + lowerTmp

          result.fill += ` M ${upperTmp} ${lowerTmp.substring(0, lowerTmp.length - 2)} z `
          result.upper += ` M ${upperTmp.substring(0, upperTmp.length - 2)} `
          result.lower += ` M ${lowerTmp.substring(0, lowerTmp.length - 2)} `
          upperTmp = ""
          lowerTmp = ""
        }
      } else if (pathsJustUncrossed) {
        ineqFalse = false
        const midX = (prevX + x) / 2
        const midUpper = (prevUpper + upper) / 2
        const midLower = (prevLower + lower) / 2
        const midY = (midUpper + midLower) / 2
        upperTmp += ` ${pointToString(midX, midY)} L `
        lowerTmp = ` ${pointToString(midX, midY)} L ` + lowerTmp
      }

      if (!ineqFalse) {
        if (Number.isFinite(upper)) {
          upperTmp = upperTmp + ` ${pointToString(x, upper)} L `
        }
        if (Number.isFinite(lower)) {
          lowerTmp = ` ${pointToString(x, lower)} L ` + lowerTmp
        }
      }

      prevX = x
      prevUpper = upper
      prevLower = lower
    },
  })

  // Push on the remaining upper and lower tmps, if any
  if (upperTmp && lowerTmp) {
    result.fill += ` M ${upperTmp} ${lowerTmp.substring(0, lowerTmp.length - 2)} z `
    result.lower += ` M ${lowerTmp.substring(0, lowerTmp.length - 2)} `
    result.upper += ` M ${upperTmp.substring(0, upperTmp.length - 2)} `
  }

  return result
}
