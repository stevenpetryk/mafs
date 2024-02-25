import CodeAndExample from "components/CodeAndExample"
import { PropTable } from "components/PropTable"

import * as LineSegmentExample from "guide-examples/LineSegmentExample"
import * as LineThroughPointsExample from "guide-examples/LineThroughPointsExample"
import * as LinePointSlopeExample from "guide-examples/LinePointSlopeExample"
import * as LinePointAngleExample from "guide-examples/LinePointAngleExample"
function Lines() {
  return (
    <>
      <p>There are a few components for lines, depending on how you want to construct them.</p>

      <h2>Line segment</h2>

      <CodeAndExample example={LineSegmentExample} />
      <PropTable of={"Line.Segment"} />

      <h2>Line through two points</h2>

      <CodeAndExample example={LineThroughPointsExample} />
      <PropTable of={"Line.ThroughPoints"} />

      <h2>Point and slope</h2>

      <CodeAndExample example={LinePointSlopeExample} />
      <PropTable of={"Line.PointSlope"} />

      <h2>Point and angle</h2>

      <CodeAndExample example={LinePointAngleExample} />
      <PropTable of={"Line.PointAngle"} />
    </>
  )
}

export default Lines
