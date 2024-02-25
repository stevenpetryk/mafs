import CodeAndExample from "components/CodeAndExample"

import PolygonExample from "guide-examples/PolygonExample"
import PolylineExample from "guide-examples/PolylineExample"
import { PropTable } from "components/PropTable"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Polygons",
}

function Polygons() {
  return (
    <>
      <p>Polygons take a number of points and create a closed shape.</p>

      <CodeAndExample example={PolygonExample} />

      <PropTable of={"Polygon"} />

      <CodeAndExample example={PolylineExample} />

      <PropTable of={"Polyline"} />
    </>
  )
}

export default Polygons
