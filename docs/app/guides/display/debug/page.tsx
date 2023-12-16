"use client"

import Code from "components/Code"
import { PropTable } from "components/PropTable"
import { Debug } from "mafs"
import Link from "next/link"

import CodeAndExample from "components/CodeAndExample"

import PizzaSliceExample from "guide-examples/custom/pizza-slice"
import PizzaSliceExampleSource from "!raw-loader!guide-examples/custom/pizza-slice"

import Example from "guide-examples/debug/PaneVisualizerExample"
import PaneVisualizerExampleSource from "!raw-loader!guide-examples/debug/PaneVisualizerExample"

export default function DebugPage() {
  return (
    <>
      <p>
        Mafs provides a few utilities for debugging or experimentation, underneath the{" "}
        <code>Debug</code> namespace.
      </p>

      <Code source={`import { Debug } from "mafs"`} language="tsx" />

      <h2>Transform widget</h2>

      <p>
        This is a little widget that allows you to test applying transforms (translation, rotation,
        and scale) to components by wrapping them in <code>Debug.TransformWrapper</code>. It's
        mainly useful when building new{" "}
        <Link href="/guides/custom-components/overview">custom components</Link>.
      </p>

      <CodeAndExample component={<PizzaSliceExample />} source={PizzaSliceExampleSource} />

      <PropTable of={"Debug.TransformWidget"} />

      <h2>Viewport info</h2>

      <p>
        This component displays Mafs' understanding of the world space that's in view, showing both
        the minimum and maximum x and y values, as well as what panes are visible according to the
        pane context.
      </p>

      <CodeAndExample component={<Example />} source={PaneVisualizerExampleSource} />

      <PropTable of={"Debug.ViewportInfo"} />
    </>
  )
}
