"use client"

import CodeAndExample from "components/CodeAndExample"

import PolygonExample from "guide-examples/PolygonExample"
import PolygonExampleSource from "!raw-loader!guide-examples/PolygonExample"
import { PropTable } from "components/PropTable"
import { Polygon } from "mafs"

function Polygons() {
  return (
    <>
      <p>Polygons take a number of points and create a closed shape.</p>

      <CodeAndExample component={<PolygonExample />} source={PolygonExampleSource} />

      <PropTable of={Polygon} />
    </>
  )
}

export default Polygons
