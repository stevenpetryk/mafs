"use client"

import CodeAndExample from "components/CodeAndExample"

import TextExample from "guide-examples/TextExample"
import TextExampleSource from "!raw-loader!guide-examples/TextExample"

function Text() {
  return (
    <>
      <p>
        The <code>Text</code> component is a pretty lightweight wrapper around SVG's{" "}
        <code>text</code>, namely that the anchor point is mapped to coordinate space.
      </p>

      <p>
        The optional <code>attach</code> will orient the text along a cardinal direction. In the
        following example, the text is attached to the "west" (<code>w</code>).
      </p>

      <p>
        All text inside of a Mafs view (even outside of <code>&lt;Text&gt;</code>) has monospace
        numbers. This means that if you have text that constantly changes, the layout of the text
        won't wiggle around as different numbers take up different amounts of horizontal space.
      </p>

      <CodeAndExample component={<TextExample />} source={TextExampleSource} />
    </>
  )
}

export default Text
