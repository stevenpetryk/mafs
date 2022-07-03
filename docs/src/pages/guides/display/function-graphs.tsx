import * as React from "react"
import GuidesLayout from "layouts/GuidesLayout"
import { Guide } from "guide"

import CodeAndExample from "components/CodeAndExample"
import Sine from "guide-examples/hello-fx/sine"
import SineSource from "!raw-loader!guide-examples/hello-fx/sine.tsx"
import Parametric from "guide-examples/Parametric"
import ParametricSource from "!raw-loader!guide-examples/Parametric.tsx"

export const frontmatter: Guide = {
  title: "Graphs",
  order: 30,
}

const Functions: React.VFC = () => (
  <GuidesLayout title={frontmatter.title}>
    <h2>
      Functions of <em className="font-display">x</em>
    </h2>

    <CodeAndExample component={<Sine />} source={SineSource} />

    <h2>Parametric functions</h2>

    <CodeAndExample component={<Parametric />} source={ParametricSource} />
  </GuidesLayout>
)

export default Functions
