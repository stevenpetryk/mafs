import { Plot, Theme } from ".."
import renderToImage from "../tests/renderToImage"

describe("<Plot.OfX />", () => {
  it("Renders", async () => {
    expect(
      await renderToImage(
        <>
          <Plot.OfX y={(x) => (x - 5) ** 2} />
          <Plot.OfX y={(x) => 5 - Math.sin(x)} style="dashed" weight={5} />
          <Plot.OfX y={(x) => 5 - (x - 5) ** 2} color="red" />
          <Plot.OfX y={(x) => 5 + Math.sin(x)} color="var(--mafs-blue)" />
        </>
      )
    ).toMatchImageSnapshot()
  })
})

describe("<Plot.OfY />", () => {
  it("Renders", async () => {
    expect(
      await renderToImage(
        <>
          <Plot.OfY x={(y) => (y - 5) ** 2} />
          <Plot.OfY x={(y) => 5 - Math.sin(y)} style="dashed" weight={5} />
          <Plot.OfY x={(y) => 5 - (y - 5) ** 2} color="red" />
          <Plot.OfY x={(y) => 5 + Math.sin(y)} color="var(--mafs-blue)" />
        </>
      )
    ).toMatchImageSnapshot()
  })
})

describe("<Plot.Parametric />", () => {
  it("Renders", async () => {
    expect(
      await renderToImage(
        <>
          {/* Good defaults test */}
          <Plot.Parametric
            t={[0, 4 * Math.PI]}
            xy={(t) => [7 + (t * Math.cos(t)) / 5, 3 + (t * Math.sin(t)) / 5]}
          />

          {/* Styles and sample rate */}
          <Plot.Parametric
            t={[0, 2 * Math.PI]}
            xy={(t) => [3 - (t * Math.cos(t)) / 3, 6 - (t * Math.sin(t)) / 3]}
            style="dashed"
            color={Theme.blue}
            weight={5}
          />

          {/* When `t` is a backwards range (higher to lower) */}
          <Plot.Parametric t={[5, 0]} xy={(t) => [t, 2 + Math.sin(t)]} color={Theme.red} />
        </>
      )
    ).toMatchImageSnapshot()
  })
})

describe("<Plot.* /> edge cases", () => {
  it("Math.sin(1/x)", async () => {
    expect(
      await renderToImage(<Plot.OfX y={(x) => Math.sin(1 / (x - 3)) + 3} maxSamplingDepth={15} />)
    ).toMatchImageSnapshot()
  })

  it("Math.tan(x)", async () => {
    expect(
      await renderToImage(<Plot.OfX y={(x) => Math.tan(x - 3) + 3} maxSamplingDepth={15} />)
    ).toMatchImageSnapshot()
  })
})
