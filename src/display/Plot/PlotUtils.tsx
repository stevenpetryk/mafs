import * as vec from "../../vec"

export function adaptiveSampling(
  xy: (t: number) => vec.Vector2,
  minSamplingDepth: number,
  maxSamplingDepth: number,
  errorThreshold: number,
  t: vec.Vector2
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
