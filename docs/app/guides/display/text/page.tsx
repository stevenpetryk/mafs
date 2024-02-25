import CodeAndExample from "components/CodeAndExample"

import * as TextExample from "guide-examples/TextExample"
import { PropTable } from "components/PropTable"

function Text() {
  return (
    <>
      <p>
        The <code>Text</code> component is a pretty lightweight wrapper around SVG's{" "}
        <code>text</code>, namely that the anchor point is mapped to coordinate space. The optional{" "}
        <code>attach</code> will orient the text along a cardinal direction ("n", "s", "nw", etc.)
      </p>

      <CodeAndExample example={TextExample} />

      <PropTable of={"Text"} />
    </>
  )
}

export default Text
