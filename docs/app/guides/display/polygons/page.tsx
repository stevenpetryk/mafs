"use client"

import CodeAndExample from "components/CodeAndExample"

import PolygonExample from "guide-examples/PolygonExample"
import PolygonExampleSource from "!raw-loader!guide-examples/PolygonExample"

function Polygons() {
  return (
    <>
      <p>Polygons take a number of points and create a closed shape.</p>

      <CodeAndExample component={<PolygonExample />} source={PolygonExampleSource} />
    </>
  )
}

export default Polygons
