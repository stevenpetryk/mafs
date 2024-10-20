export type Interval = [min: number, max: number]
export type Anchor = "tl" | "tc" | "tr" | "cl" | "cc" | "cr" | "bl" | "bc" | "br"

export function round(value: number, precision = 0): number {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

export function range(min: number, max: number, step = 1): number[] {
  const result = []
  for (let i = min; i < max - step / 2; i += step) {
    result.push(i)
  }

  const computedMax = result[result.length - 1] + step
  if (Math.abs(max - computedMax) < step / 1e-6) {
    result.push(max)
  } else {
    result.push(computedMax)
  }

  return result
}

export function clamp(number: number, min: number, max: number): number {
  return Math.min(Math.max(number, min), max)
}

/**
 * Given an anchor and a bounding box (x, y, width, height), compute the x and y coordinates of the
 * anchor such that rendering an element at those coordinates will align the element with the anchor.
 */
export function computeAnchor(
  anchor: Anchor,
  x: number,
  y: number,
  width: number,
  height: number,
): [number, number] {
  let actualX = x
  let actualY = y

  switch (anchor) {
    case "tl":
      actualX = x
      actualY = y
      break
    case "tc":
      actualX = x - width / 2
      actualY = y
      break
    case "tr":
      actualX = x - width
      actualY = y
      break
    case "cl":
      actualX = x
      actualY = y + height / 2
      break
    case "cc":
      actualX = x - width / 2
      actualY = y + height / 2
      break
    case "cr":
      actualX = x - width
      actualY = y + height / 2
      break
    case "bl":
      actualX = x
      actualY = y + height
      break
    case "bc":
      actualX = x - width / 2
      actualY = y + height
      break
    case "br":
      actualX = x - width
      actualY = y + height
      break
  }

  return [actualX, actualY]
}
