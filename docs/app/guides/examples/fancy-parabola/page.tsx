import * as React from "react"



import CodeAndExample from "components/CodeAndExample"
import FancyParabola from "guide-examples/examples/FancyParabola"
import FancyParabolaSource from "!raw-loader!guide-examples/examples/FancyParabola.tsx"

export const frontmatter: Guide = {
  title: "Fancy parabola",
  order: 2,
}

const ProjectilePage: React.VFC = () => (
  <>
    <p></p>

    <CodeAndExample source={FancyParabolaSource} component={<FancyParabola />} />
  </>
)

export default ProjectilePage
