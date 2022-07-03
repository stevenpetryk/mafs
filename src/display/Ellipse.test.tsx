import { Ellipse } from "./Ellipse"
import renderToImage from "../tests/renderToImage"

describe("<Ellipse />", () => {
  it("Renders", async () => {
    expect(
      await renderToImage(
        <>
          <Ellipse radius={[0.25, 0.5]} center={[1, 1]} />
          <Ellipse radius={[0.5, 0.25]} center={[2, 2]} />
          <Ellipse radius={[1, 0.25]} center={[4, 4]} angle={Math.PI / 3} />
          <Ellipse radius={[1, 0.25]} center={[6, 6]} angle={-Math.PI / 3} strokeStyle="dashed" />
          <Ellipse radius={[3, 3]} center={[3, 3]} strokeStyle="dashed" color="red" />
        </>
      )
    ).toMatchImageSnapshot()
  })
})
