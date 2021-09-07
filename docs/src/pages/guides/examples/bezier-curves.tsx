import React from "react"
import GuidesLayout from "layouts/GuidesLayout"
import { Guide } from "guide"

import CodeAndExample from "components/CodeAndExample"
import BezierCurves from "guide-examples/examples/BezierCurves"
import BezierCurvesSource from "!raw-loader!guide-examples/examples/BezierCurves.tsx"

export const frontmatter: Guide = {
  title: "Bézier curves",
  order: 0,
}

const ProjectilePage: React.VFC = () => (
  <GuidesLayout title={frontmatter.title}>
    <p>
      This example was inspired by Freya Holmér's excellent{" "}
      <a href="https://www.youtube.com/watch?v=aVwxzDHniEw">video on Bézier curves</a>.
    </p>

    <CodeAndExample source={BezierCurvesSource} component={<BezierCurves />} />
  </GuidesLayout>
)

export default ProjectilePage
