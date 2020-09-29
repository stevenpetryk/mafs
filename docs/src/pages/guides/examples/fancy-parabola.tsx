import React from "react"
import GuidesLayout from "layouts/GuidesLayout"
import { Guide } from "guide"

import CodeAndExample from "components/CodeAndExample"
import FancyParabola from "guide-examples/examples/FancyParabola"
import FancyParabolaSource from "!raw-loader!guide-examples/examples/FancyParabola.tsx"

export const frontmatter: Guide = {
  title: "Fancy parabola",
  order: 2,
}

const ProjectilePage: React.VFC = () => (
  <GuidesLayout title={frontmatter.title}>
    <p></p>

    <CodeAndExample source={FancyParabolaSource} component={<FancyParabola />} />
  </GuidesLayout>
)

export default ProjectilePage
