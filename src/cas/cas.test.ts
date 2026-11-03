import { describe, expect, test } from "vitest"
import {
  analyze,
  compile1,
  diff,
  evaluate,
  evaluateInterval,
  parse,
  simplify,
  toString,
  toTex,
} from "."
import type { FeatureKind } from "."

const show = (s: string) => toString(parse(s))

describe("parse", () => {
  test.each([
    ["1 + 2 * 3", 7],
    ["2^3^2", 512],
    ["-2^2", -4],
    ["2x", 6],
    ["3(x+1)", 12],
    ["1/2x", 1 / 6],
    ["|x - 5|", 2],
    ["sin^2 x + cos^2 x", 1],
    ["sqrt(x+1)", 2],
    ["cbrt(-8)", -2],
    ["2pi", 2 * Math.PI],
    ["e^0", 1],
    ["xsinx", 3 * Math.sin(3)],
    ["arctan(1)", Math.PI / 4],
    ["ln(e)", 1],
    ["log(100)", 2],
  ])("%s", (input, expected) => {
    expect(evaluate(parse(input), { x: 3 })).toBeCloseTo(expected, 12)
  })

  test("implicit multiplication binds tighter than division", () => {
    expect(show("1/(x-1)(x+2)")).toBe("1 / ((x - 1) * (x + 2))")
  })

  test("reports where parsing failed", () => {
    expect(() => parse("2 + * 3")).toThrowError(/Unexpected/)
    expect(() => parse("sin(x")).toThrowError(/Expected "\)"/)
  })
})

describe("simplify", () => {
  test.each([
    ["x + x", "2 * x"],
    ["x * x^2", "x^3"],
    ["2 * 3 * x", "6 * x"],
    ["x - x", "0"],
    ["0 * sin(x)", "0"],
    ["(x^2)^3", "x^6"],
    ["ln(e^x)", "x"],
  ])("%s => %s", (input, expected) => {
    expect(toString(simplify(parse(input)))).toBe(expected)
  })
})

describe("diff", () => {
  test.each([
    ["x^3", "3 * x^2"],
    ["sin(x)", "cos(x)"],
    ["e^x", "e^x"],
    ["ln(x)", "1 / x"],
    ["sin(x)^2 + cos(x)^2", "0"],
  ])("d/dx %s = %s", (input, expected) => {
    expect(toString(diff(parse(input)))).toBe(expected)
  })

  test("agrees with finite differences", () => {
    for (const s of ["sin(1/x)", "x^x", "tan(x^2) / (1 + x)", "atan(sqrt(x))", "|x| * x"]) {
      const f = compile1(parse(s))
      const df = compile1(diff(parse(s)))
      for (const x of [0.3, 0.7, 1.9]) {
        const h = 1e-6
        expect(df(x)).toBeCloseTo((f(x + h) - f(x - h)) / (2 * h), 4)
      }
    }
  })
})

test("toTex", () => {
  expect(toTex(parse("sin(1/x) + sqrt(x)/(x-1)"))).toBe(
    "\\sin\\left(\\frac{1}{x}\\right) + \\frac{\\sqrt{x}}{x - 1}",
  )
})

describe("interval arithmetic", () => {
  test("encloses every sampled value", () => {
    for (const s of [
      "x sin(1/x)",
      "1/(x^2 - 2)",
      "tan(x)",
      "sqrt(x) - x^3",
      "floor(3x) / (|x| + 1)",
      "x^(1/3)",
    ]) {
      const e = parse(s)
      const f = compile1(e)
      for (const [lo, hi] of [
        [0.1, 0.2],
        [-1.3, -0.9],
        [0.5, 2.5],
      ] as const) {
        const iv = evaluateInterval(e, [lo, hi])
        for (let i = 0; i <= 100; i++) {
          const v = f(lo + ((hi - lo) * i) / 100)
          if (!Number.isFinite(v)) continue
          expect(iv).not.toBeNull()
          expect(v).toBeGreaterThanOrEqual(iv![0] - 1e-12)
          expect(v).toBeLessThanOrEqual(iv![1] + 1e-12)
        }
      }
    }
  })

  test("sin of a wide interval is [-1, 1]", () => {
    expect(evaluateInterval(parse("sin(1/x)"), [0.001, 0.0011])).toEqual([-1, 1])
  })
})

describe("analyze", () => {
  const features = (s: string, range: [number, number] = [-5, 5]) =>
    analyze(parse(s), range).features.map(
      (f) => [f.kind, Math.round(f.x * 1e6) / 1e6] as [FeatureKind, number],
    )

  test.each<[string, [FeatureKind, number][]]>([
    ["1/x", [["pole", 0]]],
    ["1/x^2", [["pole", 0]]],
    ["sin(x)/x", [["removable", 0]]],
    ["(x^2-1)/(x-1)", [["removable", 1]]],
    ["sin(1/x)", [["essential", 0]]],
    ["x sin(1/x)", [["removable", 0]]],
    ["ln(x)", [["pole", 0]]],
    ["sqrt(x)", [["boundary", 0]]],
    [
      "sqrt(4 - x^2)",
      [
        ["boundary", -2],
        ["boundary", 2],
      ],
    ],
    ["|x|/x", [["jump", 0]]],
    ["|x|", [["kink", 0]]],
    [
      "1/((x-1)(x+2))",
      [
        ["pole", -2],
        ["pole", 1],
      ],
    ],
    ["e^(1/x)", [["pole", 0]]],
    ["x^2 + 1", []],
    [
      "tan(x)",
      [
        ["pole", -4.712389],
        ["pole", -1.570796],
        ["pole", 1.570796],
        ["pole", 4.712389],
      ],
    ],
  ])("%s", (s, expected) => {
    expect(features(s)).toEqual(expected)
  })

  test("finds holes at points that aren't nice numbers", () => {
    const a = Math.SQRT2
    const [f] = analyze(parse(`(x^2 - ${a * a})/(x - ${a})`), [-3, 3]).features
    expect(f.kind).toBe("removable")
    expect(f.x).toBeCloseTo(a, 12)
    expect(f.left).toMatchObject({ type: "finite" })
    expect((f.left as { limit: number }).limit).toBeCloseTo(2 * a, 6)
  })

  test("floor has a jump at every integer", () => {
    const f = analyze(parse("floor(x)"), [-2.5, 2.5]).features
    expect(f.map((x) => x.x)).toEqual([-2, -1, 0, 1, 2])
    expect(f[0]).toMatchObject({
      kind: "jump",
      left: { limit: -3 },
      right: { limit: -2 },
      value: -2,
    })
  })

  test("one-sided behavior", () => {
    const [f] = analyze(parse("e^(1/x)"), [-1, 1]).features
    expect(f.left).toEqual({ type: "finite", limit: 0 })
    expect(f.right).toEqual({ type: "infinite", sign: 1 })
  })

  test("asymptotes at infinity", () => {
    expect(analyze(parse("(2x^2 + 1)/(x^2 - 1)"), [-1, 1]).asymptotes).toEqual([
      { type: "horizontal", side: -1, y: 2 },
      { type: "horizontal", side: 1, y: 2 },
    ])
    expect(analyze(parse("(x^2 + 3x)/(x + 1)"), [-1, 1]).asymptotes).toEqual([
      { type: "oblique", side: -1, slope: 1, intercept: 2 },
      { type: "oblique", side: 1, slope: 1, intercept: 2 },
    ])
  })
})
