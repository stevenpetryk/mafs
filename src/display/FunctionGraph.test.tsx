import React from "react"
import FunctionGraph from "./FunctionGraph"
import renderToImage from "../tests/renderToImage"

describe("<FunctionGraph.OfX />", () => {
  it("Renders", async () => {
    expect(
      await renderToImage(
        <>
          <FunctionGraph.OfX y={(x) => (x - 5) ** 2} />
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
          <FunctionGraph.Parametric
            t={[0, 4 * Math.PI]}
            xy={(t) => [3 + t * Math.cos(t), 3 + t * Math.sin(t)]}
          />
        </>
      )
    ).toMatchImageSnapshot()
  })
})
