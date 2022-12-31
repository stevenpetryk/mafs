"use client"

import CodeAndExample from "components/CodeAndExample"

import SimplePoint from "guide-examples/display/SimplePoint"
import SimplePointSource from "!raw-loader!guide-examples/display/SimplePoint"

import PointsAlongFunction from "guide-examples/display/PointsAlongFunction"
import PointsAlongFunctionSource from "!raw-loader!guide-examples/display/PointsAlongFunction"

function Points() {
  return (
    <>
      <p>There's not much to this one: points can be rendered at a location.</p>

      <CodeAndExample component={<SimplePoint />} source={SimplePointSource} />
      <CodeAndExample component={<PointsAlongFunction />} source={PointsAlongFunctionSource} />
    </>
  )
}

export default Points
