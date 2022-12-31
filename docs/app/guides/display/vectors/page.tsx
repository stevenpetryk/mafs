"use client"

import * as React from "react"

import CodeAndExample from "components/CodeAndExample"
import VectorExample from "guide-examples/display/vectors/VectorExample"
import VectorExampleSource from "!raw-loader!guide-examples/display/vectors/VectorExample"

function Vectors() {
  return (
    <>
      <p>
        Vectors are a handy line-and-arrow shape for visualizing direction and magnitude. To do
        actual vector math (linear algebra), we recommend utilizing the <code>vec-la</code> package,
        as in this example:
      </p>

      <CodeAndExample component={<VectorExample />} source={VectorExampleSource} />
    </>
  )
}

export default Vectors
