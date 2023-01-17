export type Interval = [min: number, max: number]

export function round(value: number, precision = 0): number {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

export function range(min: number, max: number, step = 1): number[] {
  const result = []
  for (let i = min; i < max - step / 2; i += step) {
    result.push(i)
  }
  result.push(max)
  return result
}

export function clamp(number: number, min: number, max: number): number {
  return Math.min(Math.max(number, min), max)
}
