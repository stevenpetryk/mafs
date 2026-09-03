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
