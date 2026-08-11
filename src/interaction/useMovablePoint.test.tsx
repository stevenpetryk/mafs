import { describe, it, expect, afterEach } from "vitest"
import { createRoot, Root } from "react-dom/client"
import { act } from "react"
import { useMovablePoint, UseMovablePoint } from "./useMovablePoint"
import type { vec } from "../vec"

let container: HTMLDivElement
let root: Root

// Renders the hook and returns a holder whose `current` always reflects the
// most recent render, mirroring @testing-library's renderHook result.
function renderHook(
  initialPoint: vec.Vector2,
  args?: Parameters<typeof useMovablePoint>[1],
): { current: UseMovablePoint } {
  const holder: { current: UseMovablePoint } = { current: undefined as never }
  function Test() {
    holder.current = useMovablePoint(initialPoint, args)
    return null
  }

  container = document.createElement("div")
  root = createRoot(container)
  act(() => root.render(<Test />))
  return holder
}

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe("useMovablePoint constraints (#99)", () => {
  it("constrains the point upon initialization", () => {
    const result = renderHook([1.7, 2.3], {
      constrain: ([x]) => [Math.round(x), 0],
    })

    // The initial point [1.7, 2.3] should be snapped to [2, 0].
    expect(result.current.point).toEqual([2, 0])
    expect(result.current.x).toBe(2)
    expect(result.current.y).toBe(0)
  })

  it("constrains the point when setPoint is called", () => {
    const result = renderHook([0, 0], {
      constrain: ([x]) => [Math.round(x), 0],
    })

    act(() => result.current.setPoint([4.2, 9]))
    expect(result.current.point).toEqual([4, 0])
  })

  it("leaves the point unconstrained when no constraint is given", () => {
    const result = renderHook([1.5, 2.5])
    expect(result.current.point).toEqual([1.5, 2.5])
  })

  it("constrains horizontal movement to the initial y value", () => {
    const result = renderHook([1, 3], { constrain: "horizontal" })

    act(() => result.current.setPoint([7, 100]))
    expect(result.current.point).toEqual([7, 3])
  })

  it("constrains vertical movement to the initial x value", () => {
    const result = renderHook([2, 1], { constrain: "vertical" })

    act(() => result.current.setPoint([100, 5]))
    expect(result.current.point).toEqual([2, 5])
  })
})
