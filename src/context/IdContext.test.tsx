/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom"
import { screen, render } from "@testing-library/react"

import IdContext, { useId } from "./IdContext"

function TestComponent1() {
  const id = useId("test-component-1")

  return <p>TestComponent1 {id}</p>
}

function TestComponent2() {
  const id = useId("test-component-2")

  return <p>TestComponent2 {id}</p>
}

describe.only("useId", () => {
  it("works with one component", () => {
    render(
      <IdContext.Provider value={{}}>
        <TestComponent1 />
      </IdContext.Provider>,
    )

    screen.getByText("TestComponent1 0")
  })

  it("stays the same when rerendering", () => {
    const { rerender } = render(
      <IdContext.Provider value={{}}>
        <TestComponent1 />
      </IdContext.Provider>,
    )

    screen.getByText("TestComponent1 0")

    rerender(
      <IdContext.Provider value={{}}>
        <TestComponent1 />
      </IdContext.Provider>,
    )

    screen.getByText("TestComponent1 0")
  })

  it("increments with two of the same component", () => {
    render(
      <IdContext.Provider value={{}}>
        <TestComponent1 />
        <TestComponent1 />
      </IdContext.Provider>,
    )

    screen.getByText("TestComponent1 0")
    screen.getByText("TestComponent1 1")
  })

  it("multiple types of components don't interact", () => {
    render(
      <IdContext.Provider value={{}}>
        <TestComponent1 />
        <TestComponent2 />
      </IdContext.Provider>,
    )

    screen.getByText("TestComponent1 0")
    screen.getByText("TestComponent2 0")
  })
})
