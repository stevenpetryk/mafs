import { describe, it, expect } from "vitest"
import { vec } from "./vec"

describe("vec.midpoint", () => {
  it("returns the midpoint of two different vectors", () => {
    expect(vec.midpoint([0, 5], [6, 2])).toEqual([3, 3.5])
  })

  it("returns the midpoint of two equal vectors", () => {
    expect(vec.midpoint([1, 2], [1, 2])).toEqual([1, 2])
  })
})

describe("vec.lerp", () => {
  it("returns the first vector when t is 0", () => {
    expect(vec.lerp([1, 0], [-1, 2], 0)).toEqual([1, 0])
  })

  it("returns the second vector when t is 1", () => {
    expect(vec.lerp([1, 0], [-1, 2], 1)).toEqual([-1, 2])
  })

  it("returns the midpoint when t is 0.5", () => {
    expect(vec.lerp([1, 0], [-1, 2], 0.5)).toEqual([0, 1])
  })

  it("extrapolates when t is greater than 1", () => {
    expect(vec.lerp([1, 0], [-1, 2], 2)).toEqual([-3, 4])
  })

  it("extrapolates when t is less than than 0", () => {
    expect(vec.lerp([1, 0], [-1, 2], -1)).toEqual([3, -2])
  })

  it("always returns the same value given two equal vectors", () => {
    const v: vec.Vector2 = [0, 0]
    expect(vec.lerp(v, v, 0)).toEqual(v)
    expect(vec.lerp(v, v, 1)).toEqual(v)
    expect(vec.lerp(v, v, -1)).toEqual(v)
  })
})
