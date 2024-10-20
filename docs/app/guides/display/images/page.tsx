import { PropTable } from "components/PropTable"

import CodeAndExample from "components/CodeAndExample"
import ImageExample from "guide-examples/display/images/ImageExample"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vectors",
}

function Vectors() {
  return (
    <>
      <p>
        Images in Mafs are just wrappers around the SVG <code>image</code> element, with some
        improvements. For exa
      </p>

      <CodeAndExample example={ImageExample} />

      <PropTable of={"Vector"} />
    </>
  )
}

export default Vectors
