import { vec } from "../.."

export function adaptiveSampling(
  xy: (t: number) => vec.Vector2,
  t: vec.Vector2,
  minSamplingDepth: number,
  maxSamplingDepth: number,
  errorThreshold: number
) {
  let result = "M "

  function subdivide(
    min: number,
    max: number,
    pushLeft: boolean,
    pushRight: boolean,
    depth: number,
    xyMinX: number,
    xyMinY: number,
    xyMaxX: number,
    xyMaxY: number
  ) {
    const t = 0.5
    const mid = min + (max - min) * t

    const [xyMidX, xyMidY] = xy(mid)

    if (depth < minSamplingDepth) {
      subdivide(min, mid, true, false, depth + 1, xyMinX, xyMinY, xyMidX, xyMidY)
      subdivide(mid, max, false, true, depth + 1, xyMidX, xyMidY, xyMaxX, xyMaxY)
      return
    }

    if (depth < maxSamplingDepth) {
      const xyLerpMid = vec.lerp([xyMinX, xyMinY], [xyMaxX, xyMaxY], t)
      const error = vec.squareDist([xyMidX, xyMidY], xyLerpMid)
      if (error > errorThreshold) {
        subdivide(min, mid, true, false, depth + 1, xyMinX, xyMinY, xyMidX, xyMidY)
        subdivide(mid, max, false, true, depth + 1, xyMidX, xyMidY, xyMaxX, xyMaxY)
        return
      }
    }

    if (pushLeft && Number.isFinite(xyMinX) && Number.isFinite(xyMinY)) {
      result += `${xyMinX} ${xyMinY} L `
    }
    if (Number.isFinite(xyMidX) && Number.isFinite(xyMidY)) {
      result += `${xyMidX} ${xyMidY} L `
    }
    if (pushRight && Number.isFinite(xyMaxX) && Number.isFinite(xyMaxY)) {
      result += `${xyMaxX} ${xyMaxY} L `
    }
  }

  const [tMin, tMax] = t

  const [xyMinX, xyMinY] = xy(tMin)
  const [xyMaxX, xyMaxY] = xy(tMax)

  subdivide(tMin, tMax, true, true, 0, xyMinX, xyMinY, xyMaxX, xyMaxY)

  return result.substring(0, result.length - 2)
}

export function adaptiveSamplingBetween(
  upper: (t: number) => number,
  lower: (t: number) => number,
  t: vec.Vector2,
  minSamplingDepth: number,
  maxSamplingDepth: number,
  errorThreshold: number
) {
  const result = {
    fill: "",
    upper: "",
    lower: "",
  }

  let tmpUpper = ""
  let tmpLower = ""
  let spinch = false

  function pushPoints(x: number, upper: number, lower: number) {
    if (upper < lower && !spinch) {
      spinch = true

      if (tmpUpper && tmpLower) {
        result.fill += ` M ${tmpUpper} ${tmpLower.substring(0, tmpLower.length - 2)} z `
        result.upper += ` M ${tmpUpper.substring(0, tmpUpper.length - 2)} `
        result.lower += ` M ${tmpLower.substring(0, tmpLower.length - 2)} `
        tmpUpper = ""
        tmpLower = ""
      }
    } else if (upper > lower && spinch) {
      spinch = false
    }

    if (!spinch) {
      if (Number.isFinite(upper)) {
        tmpUpper = tmpUpper + ` ${x} ${upper} L `
      }
      if (Number.isFinite(lower)) {
        tmpLower = ` ${x} ${lower} L ` + tmpLower
      }
    }
  }

  const [tMin, tMax] = t
  const upperMin = upper(tMin)
  const upperMax = upper(tMax)
  const lowerMin = lower(tMin)
  const lowerMax = lower(tMax)

  function subdivide(
    min: number,
    max: number,
    pushLeft: boolean,
    pushRight: boolean,
    depth: number,
    upperMin: number,
    upperMax: number,
    lowerMin: number,
    lowerMax: number
  ) {
    const t = 0.5
    const mid = min + (max - min) * t

    const upperMid = upper(mid)
    const lowerMid = lower(mid)

    if (depth < minSamplingDepth) {
      subdivide(min, mid, true, false, depth + 1, upperMin, upperMid, lowerMin, lowerMid)
      subdivide(mid, max, false, true, depth + 1, upperMid, upperMax, lowerMid, lowerMax)
      return
    }

    if (depth < maxSamplingDepth) {
      const upperLerpMid = vec.lerp([min, upperMin], [max, upperMax], t)
      const lowerLerpMid = vec.lerp([min, lowerMin], [max, lowerMax], t)
      const error = Math.max(
        vec.squareDist([mid, upperMid], upperLerpMid),
        vec.squareDist([mid, lowerMid], lowerLerpMid)
      )
      if (error > errorThreshold) {
        subdivide(min, mid, true, false, depth + 1, upperMin, upperMid, lowerMin, lowerMid)
        subdivide(mid, max, false, true, depth + 1, upperMid, upperMax, lowerMid, lowerMax)
        return
      }
    }

    if (pushLeft) {
      pushPoints(min, upperMin, lowerMin)
    }

    pushPoints(mid, upperMid, lowerMid)

    if (pushRight) {
      pushPoints(max, upperMax, lowerMax)
    }
  }

  subdivide(tMin, tMax, true, true, 0, upperMin, upperMax, lowerMin, lowerMax)

  if (tmpUpper && tmpLower) {
    result.fill += ` M ${tmpUpper} ${tmpLower.substring(0, tmpLower.length - 2)} z `
    result.lower += ` M ${tmpLower.substring(0, tmpLower.length - 2)} `
    result.upper += ` M ${tmpUpper.substring(0, tmpUpper.length - 2)} `
  }

  return result
}
