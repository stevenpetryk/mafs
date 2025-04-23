import { PropTable } from "components/PropTable"
import CodeAndExample from "components/CodeAndExample"

import ScenesExample from "guide-examples/display/scenes/ScenesExample"
import Code from "components/Code"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Scenes",
}

function ScenesPage() {
  return (
    <>
      {/* <p>
        Scenes are a way to create a new coordinate space and show it inside of Mafs. This can be
        useful for doing something like showing two visualizations side-by-side.
      </p>

      <Code source={`import { Scene } from "mafs"`} language="tsx" />

      <h2>Basic scene</h2> */}

      <CodeAndExample example={ScenesExample} />

      {/* <PropTable of={"Scene"} /> */}
    </>
  )
}

export default ScenesPage
