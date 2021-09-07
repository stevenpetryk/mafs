import React from "react"
import Circle from "./Circle"
import renderToImage from "../renderToImage"

describe("<Circle />", () => {
  it("Renders", async () => {
    expect(
      await renderToImage(
        <>
          <Circle radius={0.25} center={[1, 1]} />
          <Circle radius={0.5} center={[2, 2]} />
          <Circle radius={0.5} center={[3, 3]} color="var(--mafs-blue)" fillOpacity={1} />
          <Circle radius={0.5} center={[4, 4]} color="tomato" strokeStyle="dashed" />
          <Circle radius={0.5} center={[5, 5]} weight={4} />
          <Circle radius={0.5} center={[6, 6]} svgEllipseProps={{ strokeDasharray: "9 10" }} />
        </>
      )
    ).toMatchImageSnapshot()
  })
})
