import React from "react"
import { VectorField } from ".."
import renderToImage from "../tests/renderToImage"

describe("<VectorField />", () => {
  it("Renders", async () => {
    const a = { x: 5.1, y: 5.1 }
    expect(
      await renderToImage(
        <VectorField xy={(x, y) => [y - a.y - (x - a.x), -(x - a.x) - (y - a.y)]} step={0.5} />
      )
    ).toMatchImageSnapshot()
  })

  it("Supports opacity functions", async () => {
    expect(
      await renderToImage(
        <VectorField
          xy={() => [0.5, 0.5]}
          step={1}
          xyOpacity={(x, y) => Math.min(Math.sqrt(x ** 2 + y ** 2) / 10, 1)}
        />
      )
    ).toMatchImageSnapshot()
  })
})
