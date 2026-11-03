import { describe, test, expect } from "vitest"
import { sample, sampleParametric } from "./PlotUtils"
import { sampleExpression } from "./sampleExpression"
import { analyze, parse } from "../../cas"

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

describe("sampleParametric", () => {
  const plot = (fn: (x: number) => number, domain: [number, number]) =>
    sampleParametric((x) => [x, fn(x)], domain, 8, 14, 1e-4)

  const subpaths = (d: string) => d.split("M").filter((s) => s.trim()).length

  test("continuous functions are one stroke", () => {
    expect(subpaths(plot(Math.sin, [-5, 5]))).toBe(1)
    // Steep, but continuous
    expect(subpaths(plot((x) => Math.tanh(1000 * x), [-1, 1]))).toBe(1)
  })

  test("lifts the pen at asymptotes and jumps", () => {
    expect(subpaths(plot((x) => 1 / x, [-1, 1.1]))).toBe(2)
    expect(subpaths(plot(Math.tan, [-5, 5]))).toBe(5)
    expect(subpaths(plot(Math.floor, [-0.5, 2.5]))).toBe(4)
  })

  test("lifts the pen where the function is undefined", () => {
    expect(subpaths(plot((x) => Math.sqrt(1 - x * x), [-3, 3]))).toBe(1)
    expect(subpaths(plot((x) => Math.sqrt(Math.sin(x)), [-7, 7]))).toBe(3)
  })

  test("clips to a box", () => {
    const d = sampleParametric((x) => [x, 1 / x], [-1, 1.1], 8, 14, 1e-4, {
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
    })
    const ys = d.match(/-?[\d.e+-]+/g)!.map(Number)
    expect(Math.max(...ys.map(Math.abs))).toBeLessThanOrEqual(10)
  })
})

describe("sampleExpression", () => {
  test("a fully aliased region is one band, with no curve slivers inside it", () => {
    const expr = parse("sin(1/x)")
    const domain: [number, number] = [-0.003, 0.003]
    const { curve, band } = sampleExpression({
      expr,
      analysis: analyze(expr, domain),
      domain,
      pixelWidth: 0.006 / 1000,
      minDepth: 8,
      maxDepth: 14,
      threshold: 1e-10,
      clip: { xMin: -1, xMax: 1, yMin: -2, yMax: 2 },
    })
    expect(band.split("M").filter((s) => s.trim()).length).toBe(1)
    expect(curve.split("M").filter((s) => s.trim()).length).toBeLessThanOrEqual(2)
  })
})
