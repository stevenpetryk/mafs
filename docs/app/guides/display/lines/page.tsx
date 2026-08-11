import CodeAndExample from "components/CodeAndExample"
import Code from "components/Code"
import { PropTable } from "components/PropTable"

import LineSegmentExample from "guide-examples/LineSegmentExample"
import LineThroughPointsExample from "guide-examples/LineThroughPointsExample"
import LinePointSlopeExample from "guide-examples/LinePointSlopeExample"
import LinePointAngleExample from "guide-examples/LinePointAngleExample"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lines",
}

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

      <h2>Horizontal and vertical lines</h2>

      <p>
        For the common cases where a line is parallel to an axis, use <code>Line.Horizontal</code>{" "}
        or <code>Line.Vertical</code>. They accept the coordinate of the fixed axis and the same
        styling props as the other line components.
      </p>

      <Code
        language="tsx"
        source={
          "<Line.Horizontal y={2} color={Theme.blue} />\n<Line.Vertical x={-1} color={Theme.green} />"
        }
      />
      <PropTable of={"Line.Horizontal"} />
      <PropTable of={"Line.Vertical"} />
    </>
  )
}

export default Lines
