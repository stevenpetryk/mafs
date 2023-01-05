"use client"

import CodeAndExample from "components/CodeAndExample"

import SimplePoint from "guide-examples/display/SimplePoint"
import SimplePointSource from "!raw-loader!guide-examples/display/SimplePoint"

import { PropTable } from "components/PropTable"
import { Point } from "mafs"

function Points() {
  return (
    <>
      <p>Points are dots that can be rendered at a location (x, y).</p>

      <CodeAndExample component={<SimplePoint />} source={SimplePointSource} />

      <PropTable of={Point} />
    </>
  )
}

export default Points
