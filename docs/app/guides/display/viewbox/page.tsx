"use client"

import Code from "components/Code"
import CodeAndExample from "components/CodeAndExample"

import ContainViewboxExample from "guide-examples/display/viewbox/ContainViewbox"
import ContainViewboxExampleSource from "!raw-loader!guide-examples/display/viewbox/ContainViewbox"

import StretchViewboxExample from "guide-examples/display/viewbox/StretchViewbox"
import StretchViewboxExampleSource from "!raw-loader!guide-examples/display/viewbox/StretchViewbox"

function ViewboxPage() {
  return (
    <>
      <p>
        When showing a visualization, it's useful to think of your content as having a useful
        "viewbox" designating the region in which interesting things are happening. Mafs allows you
        to specify this with the <code>viewBox</code> prop.
      </p>

      <CodeAndExample component={<ContainViewboxExample />} source={ContainViewboxExampleSource} />

      <h2>Fit strategies</h2>

      <p>
        The <code>preserveAspectRatio</code> prop changes how the viewbox is rendered in the
        viewport. Setting it to <code>false</code> will stretch the viewbox to fit the viewport,
        tossing aside the aspect ratio preservation.
      </p>

      <CodeAndExample component={<StretchViewboxExample />} source={StretchViewboxExampleSource} />

      <p>
        The only other option is <code>"contain"</code> for now, which is also the default.
      </p>

      <h2>Padding</h2>

      <p>
        Mafs adds a padding of <code>0.5</code> to all visualizations by default. To change or
        remove padding, you can specify <code>padding</code> in the <code>viewBox</code> object.
      </p>

      <Code
        source={`
          <Mafs viewBox={{ ..., padding: 0 }}>
            {/* ... */}
          </Mafs>
        `}
        language="tsx"
      />
    </>
  )
}

export default ViewboxPage
