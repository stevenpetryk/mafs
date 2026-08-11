import { test, expect } from "vitest"
import { sample, sampleParametric } from "./PlotUtils"

test("sample", () => {
  const ts: number[] = []

  sample<number>({
    domain: [0, 8],
    minDepth: 3,
    maxDepth: 3,
    error: () => Number.POSITIVE_INFINITY,
    fn: (t) => t,
    lerp: () => 0,
    onPoint(t) {
      ts.push(t)
    },
    threshold: 0,
  })

  // Since the sample function deliberately introduces randomness, we round to test.
  const roundedTs = ts.map(Math.round)

  expect(roundedTs).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
})

function countSubpaths(path: string): number {
  // Each subpath starts with an "M" command; "L" commands continue one.
  return path.split("M").length - 1
}

test("sampleParametric produces a single subpath by default", () => {
  const path = sampleParametric((x) => [x, x], [0, 8], 3, 3, 0)
  expect(path.startsWith("M")).toBe(true)
  expect(countSubpaths(path)).toBe(1)
})

test("sampleParametric breaks the path at exclusion points (#133)", () => {
  const path = sampleParametric((x) => [x, x], [0, 8], 3, 3, 0, [4])
  // A single exclusion should split the curve into exactly two subpaths.
  expect(countSubpaths(path)).toBe(2)
})

test("sampleParametric breaks the path at multiple exclusion points (#133)", () => {
  const path = sampleParametric((x) => [x, x], [0, 9], 3, 3, 0, [3, 6])
  expect(countSubpaths(path)).toBe(3)
})

test("sampleParametric breaks the path when the function is not finite", () => {
  // Returns a non-finite y for a band in the middle of the domain, so there are
  // finite points on both sides of the gap. A high minimum depth guarantees the
  // sampler evaluates points inside the band.
  const path = sampleParametric((x) => [x, x > 3 && x < 5 ? NaN : x], [0, 8], 8, 8, 0)
  expect(countSubpaths(path)).toBeGreaterThan(1)
})
