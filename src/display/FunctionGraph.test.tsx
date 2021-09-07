import React from "react"
import { FunctionGraph, Theme } from ".."
import renderToImage from "../tests/renderToImage"

describe("<FunctionGraph.OfX />", () => {
  it("Renders", async () => {
    expect(
      await renderToImage(
        <>
          <FunctionGraph.OfX y={(x) => (x - 5) ** 2} />
          <FunctionGraph.OfX y={(x) => 5 - Math.sin(x)} style="dashed" weight={5} />
          <FunctionGraph.OfX y={(x) => 5 - (x - 5) ** 2} color="red" />
          <FunctionGraph.OfX y={(x) => 5 + Math.sin(x)} color="var(--mafs-blue)" />
        </>
      )
    ).toMatchImageSnapshot()
  })
})

describe("<FunctionGraph.Parametric />", () => {
  it("Renders", async () => {
    expect(
      await renderToImage(
        <>
          {/* Good defaults test */}
          <FunctionGraph.Parametric
            t={[0, 4 * Math.PI]}
            xy={(t) => [7 + (t * Math.cos(t)) / 5, 3 + (t * Math.sin(t)) / 5]}
          />

          {/* Styles and sample rate */}
          <FunctionGraph.Parametric
            t={[0, 2 * Math.PI]}
            xy={(t) => [3 - (t * Math.cos(t)) / 3, 6 - (t * Math.sin(t)) / 3]}
            style="dashed"
            color={Theme.blue}
            weight={5}
            samples={10}
          />

          {/* When `t` is a backwards range (higher to lower) */}
          <FunctionGraph.Parametric t={[5, 0]} xy={(t) => [t, 2 + Math.sin(t)]} color={Theme.red} />
        </>
      )
    ).toMatchImageSnapshot()
  })
})
