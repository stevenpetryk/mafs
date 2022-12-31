import * as React from "react"



import CodeAndExample from "components/CodeAndExample"

import SimplePoint from "guide-examples/display/SimplePoint"
import SimplePointSource from "!raw-loader!guide-examples/display/SimplePoint"

import PointsAlongFunction from "guide-examples/display/PointsAlongFunction"
import PointsAlongFunctionSource from "!raw-loader!guide-examples/display/PointsAlongFunction"

export const frontmatter: Guide = {
  title: "Points",
  order: 0,
}

const Points: React.VFC = () => (
  <>
    <p>
      There's not much to this one: points can be rendered at a location{" "}
      <em className="font-display">(x, y)</em>. Plain old <code>&lt;Point&gt;</code>s cannot be
      dragged—for that, see <a href="/guides/interaction/movable-points/">Movable points</a>.
    </p>

    <CodeAndExample component={<SimplePoint />} source={SimplePointSource} />
    <CodeAndExample component={<PointsAlongFunction />} source={PointsAlongFunctionSource} />
  </>
)

export default Points
