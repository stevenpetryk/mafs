import CodeAndExample from "components/CodeAndExample"

import SimplePoint from "guide-examples/display/SimplePoint"

import { PropTable } from "components/PropTable"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Points",
}

function Points() {
  return (
    <>
      <p>Points are dots that can be rendered at a location (x, y).</p>

      <CodeAndExample example={SimplePoint} />

      <PropTable of={"Point"} />
    </>
  )
}

export default Points
