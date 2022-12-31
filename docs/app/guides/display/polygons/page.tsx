"use client"

import CodeAndExample from "components/CodeAndExample"

import PolygonExample from "guide-examples/PolygonExample"
import PolygonExampleSource from "!raw-loader!guide-examples/PolygonExample"
import Floor from "guide-examples/Floor"
import FloorSource from "!raw-loader!guide-examples/Floor"

function Polygons() {
  return (
    <>
      <p>Polygons take a number of points and create a closed shape.</p>

      <CodeAndExample component={<PolygonExample />} source={PolygonExampleSource} />

      <h2>Floors</h2>

      <p>
        If you're making a physics animation, it can be helpful to include some kind of "floor". Use
        a polygon for this. Make it green if you want it to look like grass.
      </p>

      <CodeAndExample component={<Floor />} source={FloorSource} />
    </>
  )
}

export default Polygons
