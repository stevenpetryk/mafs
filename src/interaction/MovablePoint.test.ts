import { MovablePoint, MovablePointSVG } from "./MovablePoint"

describe("MovablePoint", () => {
    it("has a human-readable displayName", () => {
        expect(MovablePoint.displayName).toBe("MovablePoint");
    })
})

describe("MovablePointSVG", () => {
    it("has a human-readable displayName", () => {
        expect(MovablePointSVG.displayName).toBe("MovablePointSVG");
    })
})
