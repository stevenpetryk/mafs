"use client"
import CodeAndExample from "components/CodeAndExample"
import { PropTable } from "components/PropTable"

import { LaTeX } from "mafs"

import LatexExample from "components/guide-examples/display/Latex"
import LatexExampleSource from "!raw-loader!components/guide-examples/display/Latex"

import LatexDocExample from "components/guide-examples/display/LatexDoc"
import LatexDocExampleSource from "!raw-loader!components/guide-examples/display/LatexDoc"
import WIP from "components/WIP"

export default function LatexPage() {
  return (
    <>
      <PropTable of={LaTeX} />
      <WIP>
        This component does not work properly in Safari due to some quirks with how WebKit handles
        the SVG foreignObject element.
      </WIP>
      <CodeAndExample component={<LatexExample />} source={LatexExampleSource} />
      <CodeAndExample component={<LatexDocExample />} source={LatexDocExampleSource} />
    </>
  )
}
