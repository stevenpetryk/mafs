import CodeAndExample from "components/CodeAndExample"

import * as PolygonExample from "guide-examples/PolygonExample"
import * as PolylineExample from "guide-examples/PolylineExample"
import { PropTable } from "components/PropTable"

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
