import { describe, it, expect, afterEach } from "vitest"
import { createRoot, Root } from "react-dom/client"
import { act } from "react"
import { useStopwatch, Stopwatch, StopwatchArguments } from "./useStopwatch"

let container: HTMLDivElement
let root: Root

// Renders the hook and returns a holder whose `current` always reflects the
// most recent render, mirroring @testing-library's renderHook result.
function renderHook(args?: StopwatchArguments): { current: Stopwatch } {
  const holder: { current: Stopwatch } = { current: undefined as never }
  function Test() {
    holder.current = useStopwatch(args)
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

describe("useStopwatch (#65)", () => {
  it("starts at startTime and is not playing", () => {
    const result = renderHook({ startTime: 2, endTime: 10 })
    expect(result.current.time).toBe(2)
    expect(result.current.playing).toBe(false)
  })

  it("jumps to a key frame with setTime", () => {
    const result = renderHook({ startTime: 0, endTime: 10 })
    act(() => result.current.setTime(5))
    expect(result.current.time).toBe(5)
  })

  it("resets back to startTime on stop", () => {
    const result = renderHook({ startTime: 1, endTime: 10 })
    act(() => result.current.setTime(7))
    expect(result.current.time).toBe(7)
    act(() => result.current.stop())
    expect(result.current.time).toBe(1)
  })

  it("plays in reverse when reversed is set", () => {
    // A reversed stopwatch begins at endTime and counts down to startTime.
    const result = renderHook({ startTime: 0, endTime: 10, reversed: true })
    expect(result.current.time).toBe(10)

    // Moving the timeline to 25% should display 75% of the way through.
    act(() => result.current.setTime(2.5))
    expect(result.current.time).toBe(7.5)
  })

  it("applies an easing function to the displayed time", () => {
    const square = (t: number) => t * t
    const result = renderHook({ startTime: 0, endTime: 10, ease: square })

    // setTime positions the underlying timeline; the displayed time is eased.
    act(() => result.current.setTime(5)) // timeline at 50% -> eased to 25% -> 2.5
    expect(result.current.rawTime).toBe(5)
    expect(result.current.time).toBe(2.5)
  })

  it("combines reversing and easing", () => {
    const square = (t: number) => t * t
    const result = renderHook({ startTime: 0, endTime: 10, reversed: true, ease: square })

    // Timeline at 25% -> reversed to 75% -> eased (0.75^2) -> 5.625
    act(() => result.current.setTime(2.5))
    expect(result.current.time).toBeCloseTo(5.625)
  })
})
