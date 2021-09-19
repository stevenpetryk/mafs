import React from "react"
import GuidesLayout from "../../../layouts/GuidesLayout"
import { Guide } from "guide"

import CodeAndExample from "../../../components/CodeAndExample"
import VectorExample from "guide-examples/display/vectors/VectorExample"
import VectorExampleSource from "!raw-loader!guide-examples/display/vectors/VectorExample"

export const frontmatter: Guide = {
  title: "Vectors",
  order: 40,
}

const Vectors: React.VFC = () => (
  <GuidesLayout title={frontmatter.title}>
    <p>
      Vectors are a handy line-and-arrow shape for visualizing direction and magnitude. To do actual
      vector math (linear algebra), we recommend utilizing the <code>vec-la</code> package, as in
      this example:
    </p>

    <CodeAndExample component={<VectorExample />} source={VectorExampleSource} />
  </GuidesLayout>
)

export default Vectors
