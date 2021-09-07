import React from "react"
import { VectorField } from ".."
import renderToImage from "../tests/renderToImage"

describe("<VectorField />", () => {
  it("Renders", async () => {
    const a = { x: 5.1, y: 5.1 }
    expect(
      await renderToImage(
        <>
          <VectorField xy={(x, y) => [y - a.y - (x - a.x), -(x - a.x) - (y - a.y)]} step={0.5} />
        </>
      )
    ).toMatchImageSnapshot()
  })
})
