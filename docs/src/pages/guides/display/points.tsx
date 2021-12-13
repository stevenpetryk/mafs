import React from "react"
import GuidesLayout from "layouts/GuidesLayout"
import { Guide } from "guide"

import CodeAndExample from "components/CodeAndExample"

import SimplePointSource from "!raw-loader!guide-examples/display/SimplePoint"

import PointsAlongFunctionSource from "!raw-loader!guide-examples/display/PointsAlongFunction"

export const frontmatter: Guide = {
  title: "Points",
  order: 0,
}

const Points: React.VFC = () => (
  <GuidesLayout title={frontmatter.title}>
    <p>
      There's not much to this one: points can be rendered at a location{" "}
      <em className="font-display">(x, y)</em>. Plain old <code>&lt;Point&gt;</code>s cannot be
      dragged—for that, see <a href="/guides/interaction/movable-points/">Movable points</a>.
    </p>

    <CodeAndExample source={SimplePointSource} />
    <CodeAndExample source={PointsAlongFunctionSource} />
  </GuidesLayout>
)

export default Points
