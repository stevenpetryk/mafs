"use client"

import { Vector } from "mafs"
import { PropTable } from "components/PropTable"

import CodeAndExample from "components/CodeAndExample"
import VectorExample from "guide-examples/display/vectors/VectorExample"
import VectorExampleSource from "!raw-loader!guide-examples/display/vectors/VectorExample"

function Vectors() {
  return (
    <>
      <p>Vectors are a handy line-and-arrow shape for visualizing direction and magnitude.</p>

      <p>
        Mafs ships with a small selection of common linear algebra functions (for both vectors and
        matrices), exposing them as <code>vec</code>. Those utilities are used extensively here.
      </p>

      <CodeAndExample component={<VectorExample />} source={VectorExampleSource} />

      <PropTable of={Vector} />
    </>
  )
}

export default Vectors
