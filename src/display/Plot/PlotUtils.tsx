import { vec } from "../../algebra"
import type { Vector2 } from "../../algebra/types"

interface SampleParams<P> {
  /** The function to sample */
  fn: (t: number) => P
  /** A function that computes the error between a real sample function output and a midpoint output */
  error: (real: P, estimate: P) => number
  /** A function that computes the midpoint of two sample function outputs */
  midpoint: (p1: P, p2: P) => P
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
 * A relatively generic internal function which, given a function, domain, and
 * an error function, will recursively subdivide the domain until sampling said
 * function at each point in the domain yields an error less than the supplied
 * threshold. Importantly, this makes no assumptions about the return type of
 * the sampled function.
 */
function sample<SampledReturnType>({
  domain,
  minDepth,
  maxDepth,
  threshold,
  fn,
  error,
  onPoint,
  midpoint,
}: SampleParams<SampledReturnType>) {
  const [min, max] = domain

  function subdivide(
    min: number,
    max: number,
    pushLeft: boolean,
    pushRight: boolean,
    depth: number,
    pMin: SampledReturnType,
    pMax: SampledReturnType,
  ) {
    const t = 0.5
    const mid = min + (max - min) * t
    const pMid = fn(mid)

    if (depth < minDepth) {
      subdivide(min, mid, true, false, depth + 1, pMin, pMid)
      subdivide(mid, max, false, true, depth + 1, pMid, pMax)
      return
    }

    if (depth < maxDepth) {
      const fnMidpoint = midpoint(pMin, pMax)
      const e = error(pMid, fnMidpoint)
      if (e > threshold) {
        subdivide(min, mid, true, false, depth + 1, pMin, pMid)
        subdivide(mid, max, false, true, depth + 1, pMid, pMax)
        return
      }
    }

    if (pushLeft) {
      onPoint(min, pMin)
    }
    onPoint(mid, pMid)
    if (pushRight) {
      onPoint(max, pMax)
    }
  }

  subdivide(min, max, true, true, 0, fn(min), fn(max))
}

export function sampleParametric(
  fn: (t: number) => Vector2,
  domain: Vector2,
  minDepth: number,
  maxDepth: number,
  threshold: number,
) {
  let result = "M "

  sample({
    fn,
    error: (a, b) => vec.squareDist(a, b),
    onPoint: (_t, [x, y]) => {
      if (Number.isFinite(x) && Number.isFinite(y)) {
        result += `${x} ${y} L `
      }
    },
    midpoint: (p1, p2) => vec.midpoint(p1, p2),
    domain,
    minDepth,
    maxDepth,
    threshold,
  })

  return result.substring(0, result.length - 2)
}

export function sampleInequality(
  rangeAxis: "x" | "y",
  upper: (t: number) => number,
  lower: (t: number) => number,
  domain: Vector2,
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

  sample<[Vector2, Vector2]>({
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
    midpoint: ([aLower, aUpper], [bLower, bUpper]) => {
      return [vec.midpoint(aLower, bLower), vec.midpoint(aUpper, bUpper)]
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
