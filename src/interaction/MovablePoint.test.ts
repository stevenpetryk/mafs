import { describe, it, expect } from "vitest"
import { MovablePoint } from "./MovablePoint"

describe("MovablePoint", () => {
  it("has a human-readable displayName", () => {
    expect(MovablePoint.displayName).toBe("MovablePoint")
  })
})
