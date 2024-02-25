import CodeAndExample from "components/CodeAndExample"
import BezierCurves from "guide-examples/examples/BezierCurves"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bezier curves",
}

export default function BezierCurvesPage() {
  return (
    <>
      <p>
        This example was inspired by Freya Holmér's excellent{" "}
        <Link href="https://www.youtube.com/watch?v=aVwxzDHniEw">video on Bézier curves</Link>.
      </p>

      <CodeAndExample example={BezierCurves} />
    </>
  )
}
