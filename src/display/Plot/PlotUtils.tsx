import { vec } from "../../vec"

interface SampleParams<P> {
  fn: (t: number) => P
  error: (real: P, estimate: P) => number
  midpoint: (p1: P, p2: P) => P
  onPoint: (t: number, p: P) => void
  domain: [min: number, max: number]
  minDepth: number
  maxDepth: number
  threshold: number
}

/**
 * A relatively generic internal function which, given a function, domain, and
 * an error function, will recursively subdivide the domain until sampling said
 * function at each point in the domain yields an error less than the supplied
 * threshold.
 *
 * The function makes no assumptions about the return type of the sampled.
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
    pMax: SampledReturnType
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
      const pLerpMid = midpoint(pMin, pMax)
      const e = error(pMid, pLerpMid)
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
  fn: (t: number) => vec.Vector2,
  domain: vec.Vector2,
  minDepth: number,
  maxDepth: number,
  threshold: number
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
  upper: (t: number) => number,
  lower: (t: number) => number,
  domain: vec.Vector2,
  minDepth: number,
  maxDepth: number,
  threshold: number
) {
  const result = {
    fill: "",
    upper: "",
    lower: "",
  }

  let upperTmp = ""
  let lowerTmp = ""
  let ineqFalse = false

  sample<[vec.Vector2, vec.Vector2]>({
    domain,
    minDepth,
    maxDepth,
    threshold,
    fn: (t) => {
      return [
        [t, lower(t)],
        [t, upper(t)],
      ]
    },
    error: ([realLower, realUpper], [estLower, estUpper]) => {
      return Math.max(vec.squareDist(realLower, estLower), vec.squareDist(realUpper, estUpper))
    },
    midpoint: ([aLower, aUpper], [bLower, bUpper]) => {
      return [vec.midpoint(aLower, bLower), vec.midpoint(aUpper, bUpper)]
    },
    onPoint: (t, [l, u]) => {
      const lower = l[1]
      const upper = u[1]

      // TODO: these inequality operators should reflect the props, perhaps
      // the inequality operator itself should be a function passed into this
      const pathsJustCrossed = upper < lower && !ineqFalse
      const pathsJustUncrossed = upper > lower && ineqFalse

      if (pathsJustCrossed) {
        ineqFalse = true

        if (upperTmp && lowerTmp) {
          result.fill += ` M ${upperTmp} ${lowerTmp.substring(0, lowerTmp.length - 2)} z `
          result.upper += ` M ${upperTmp.substring(0, upperTmp.length - 2)} `
          result.lower += ` M ${lowerTmp.substring(0, lowerTmp.length - 2)} `
          upperTmp = ""
          lowerTmp = ""
        }
      } else if (pathsJustUncrossed) {
        ineqFalse = false
      }

      if (!ineqFalse) {
        if (Number.isFinite(upper)) {
          upperTmp = upperTmp + ` ${t} ${upper} L `
        }
        if (Number.isFinite(lower)) {
          lowerTmp = ` ${t} ${lower} L ` + lowerTmp
        }
      }
      return result
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
