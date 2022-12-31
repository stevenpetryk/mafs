import type { Vector2 } from "./vec"

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

export function triangleArea(a: Vector2, b: Vector2, c: Vector2): number {
  const ax = a[0]
  const ay = a[1]
  const bx = b[0]
  const by = b[1]
  const cx = c[0]
  const cy = c[1]
  return Math.abs((ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) / 2)
}
