import { describe, it, expect } from "vitest"
import { MovablePointDisplay } from "./MovablePointDisplay"

describe("MovablePointDisplay", () => {
  it("has a human-readable displayName", () => {
    expect(MovablePointDisplay.displayName).toBe("MovablePointDisplay")
  })
})
