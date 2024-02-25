import CodeAndExample from "components/CodeAndExample"

import * as SimplePoint from "guide-examples/display/SimplePoint"

import { PropTable } from "components/PropTable"

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
