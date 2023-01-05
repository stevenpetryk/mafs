"use client"

import { Text as T } from "mafs"
import CodeAndExample from "components/CodeAndExample"

import TextExample from "guide-examples/TextExample"
import TextExampleSource from "!raw-loader!guide-examples/TextExample"
import { PropTable } from "components/PropTable"

function Text() {
  return (
    <>
      <p>
        The <code>Text</code> component is a pretty lightweight wrapper around SVG's{" "}
        <code>text</code>, namely that the anchor point is mapped to coordinate space. The optional{" "}
        <code>attach</code> will orient the text along a cardinal direction ("n", "s", "nw", etc.)
      </p>

      <CodeAndExample component={<TextExample />} source={TextExampleSource} />

      <PropTable of={T} />
    </>
  )
}

export default Text
