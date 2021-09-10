import { clamp, range, round } from "./math"

describe("clamp", () => {
  it("clamps a number between two values", () => {
    expect(clamp(0, 1, 2)).toBe(1)
    expect(clamp(10, 0, 1)).toBe(1)
    expect(clamp(-10, 0, 1)).toBe(0)
  })
})

describe("range", () => {
  it("generates a range", () => {
    expect(range(0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it("generates a range with a step", () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10])
  })

  it("handles when the step introduces weird floating point errors", () => {
    const problematicRange = range(0, 0.6, 0.2)
    expect(problematicRange[0]).toEqual(0)
    expect(problematicRange[1]).toBeCloseTo(0.2)
    expect(problematicRange[2]).toBeCloseTo(0.4)
    expect(problematicRange[3]).toEqual(0.6)
  })
})

describe("round", () => {
  it("rounds toward zero in the trivial case", () => {
    expect(round(0.2)).toEqual(0)
    expect(round(-0.2)).toEqual(-0)

    expect(round(0.12, 1)).toEqual(0.1)
    expect(round(-0.12, 1)).toEqual(-0.1)
  })

  it("rounds away from zero in the trivial case", () => {
    expect(round(0.8)).toEqual(1)
    expect(round(-0.8)).toEqual(-1)

    expect(round(0.08, 1)).toEqual(0.1)
    expect(round(-0.08, 1)).toEqual(-0.1)
  })

  it("rounds away from zero with 0.5, and toward zero with -0.5 (JS quirk, but acceptable for internal use)", () => {
    expect(round(0.5)).toEqual(1)
    expect(round(-0.5)).toEqual(-0)
  })
})
