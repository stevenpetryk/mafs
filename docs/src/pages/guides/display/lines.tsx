import * as React from "react"
import GuidesLayout from "layouts/GuidesLayout"
import { Guide } from "guide"

import CodeAndExample from "components/CodeAndExample"

import LineSegmentExample from "guide-examples/LineSegmentExample"
import LineSegmentExampleSource from "!raw-loader!guide-examples/LineSegmentExample"
import LineThroughPointsExample from "guide-examples/LineThroughPointsExample"
import LineThroughPointsExampleSource from "!raw-loader!guide-examples/LineThroughPointsExample"
import LinePointSlopeExample from "guide-examples/LinePointSlopeExample"
import LinePointSlopeExampleSource from "!raw-loader!guide-examples/LinePointSlopeExample"
import LinePointAngleExample from "guide-examples/LinePointAngleExample"
import LinePointAngleExampleSource from "!raw-loader!guide-examples/LinePointAngleExample"

export const frontmatter: Guide = {
  title: "Lines",
  order: 10,
}

const Lines: React.VFC = () => {
  return (
    <GuidesLayout title={frontmatter.title}>
      <p>There are a few components for lines, depending on how you want to construct them.</p>

      <h2>Line segment</h2>

      <CodeAndExample component={<LineSegmentExample />} source={LineSegmentExampleSource} />

      <h2>Line through two points</h2>

      <CodeAndExample
        component={<LineThroughPointsExample />}
        source={LineThroughPointsExampleSource}
      />

      <h2>Point and slope</h2>

      <CodeAndExample component={<LinePointSlopeExample />} source={LinePointSlopeExampleSource} />

      <h2>Point and angle</h2>

      <CodeAndExample component={<LinePointAngleExample />} source={LinePointAngleExampleSource} />
    </GuidesLayout>
  )
}

export default Lines
