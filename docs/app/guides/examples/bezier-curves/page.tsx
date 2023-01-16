"use client"

import CodeAndExample from "components/CodeAndExample"
import BezierCurves from "guide-examples/examples/BezierCurves"
import BezierCurvesSource from "!raw-loader!guide-examples/examples/BezierCurves.tsx"

export default function BezierCurvesPage() {
  return (
    <>
      <p>
        This example was inspired by Freya Holmér's excellent{" "}
        <a href="https://www.youtube.com/watch?v=aVwxzDHniEw">video on Bézier curves</a>.
      </p>

      <CodeAndExample source={BezierCurvesSource} component={<BezierCurves />} />
    </>
  )
}
