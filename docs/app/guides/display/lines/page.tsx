import CodeAndExample from "components/CodeAndExample"
import { PropTable } from "components/PropTable"

import LineSegmentExample from "guide-examples/LineSegmentExample"
import LineSegmentExampleSource from "!raw-loader!guide-examples/LineSegmentExample"
import LineThroughPointsExample from "guide-examples/LineThroughPointsExample"
import LineThroughPointsExampleSource from "!raw-loader!guide-examples/LineThroughPointsExample"
import LinePointSlopeExample from "guide-examples/LinePointSlopeExample"
import LinePointSlopeExampleSource from "!raw-loader!guide-examples/LinePointSlopeExample"
import LinePointAngleExample from "guide-examples/LinePointAngleExample"
import LinePointAngleExampleSource from "!raw-loader!guide-examples/LinePointAngleExample"

function Lines() {
  return (
    <>
      <p>There are a few components for lines, depending on how you want to construct them.</p>

      <h2>Line segment</h2>

      <CodeAndExample component={<LineSegmentExample />} source={LineSegmentExampleSource} />
      <PropTable of={"Line.Segment"} />

      <h2>Line through two points</h2>

      <CodeAndExample
        component={<LineThroughPointsExample />}
        source={LineThroughPointsExampleSource}
      />
      <PropTable of={"Line.ThroughPoints"} />

      <h2>Point and slope</h2>

      <CodeAndExample component={<LinePointSlopeExample />} source={LinePointSlopeExampleSource} />
      <PropTable of={"Line.PointSlope"} />

      <h2>Point and angle</h2>

      <CodeAndExample component={<LinePointAngleExample />} source={LinePointAngleExampleSource} />
      <PropTable of={"Line.PointAngle"} />
    </>
  )
}

export default Lines
