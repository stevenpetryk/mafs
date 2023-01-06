"use client"
import CodeAndExample from "components/CodeAndExample"

import LatexExample from "components/guide-examples/display/Latex"
import LatexExampleSource from "!raw-loader!components/guide-examples/display/Latex"

import LatexDocExample from "components/guide-examples/display/LatexDoc"
import LatexDocExampleSource from "!raw-loader!components/guide-examples/display/LatexDoc"

export default function LatexPage() {
  return (
    <>
      <CodeAndExample component={<LatexExample />} source={LatexExampleSource} />
      <CodeAndExample component={<LatexDocExample />} source={LatexDocExampleSource} />
    </>
  )
}
