"use client"

import CodeAndExample from "components/CodeAndExample"

import OfXAndY from "guide-examples/plots/of-x-and-y"
import OfXAndYSource from "!raw-loader!guide-examples/plots/of-x-and-y.tsx"

import TwistyBoi from "guide-examples/plots/twisty-boi"
import TwistyBoiSource from "!raw-loader!guide-examples/plots/twisty-boi.tsx"

import SineStressTest from "guide-examples/plots/sine-stress-test"
import SineStressTestSource from "!raw-loader!guide-examples/plots/sine-stress-test.tsx"

import { PropTable } from "components/PropTable"
import { Plot } from "mafs"

function Functions() {
  return (
    <>
      <p>
        Mafs supports numerically plotting a number of function types by passing in plain JavaScript
        functions.
      </p>

      <h2>
        Functions of <em className="font-display">x</em> and <em className="font-display">y</em>
      </h2>
      <CodeAndExample component={<OfXAndY />} source={OfXAndYSource} />
      <PropTable of={Plot.OfX} displayName="Plot.OfX" />
      <PropTable of={Plot.OfY} displayName="Plot.OfY" />

      <h2>Parametric functions</h2>
      <CodeAndExample component={<TwistyBoi />} source={TwistyBoiSource} />
      <PropTable of={Plot.Parametric} displayName="Plot.Parametric" />

      <h2>Render quality</h2>

      <p>
        These <code>Plot</code> components are <strong>not</strong> a computer algebra system (CAS).
        They use numerical methods for evaluating a function and attempting to plot it accurately.
        This works well for most functions, but it's far from perfect.
      </p>

      <p>
        Mafs samples functions by by recursively subdividing the domain until an estimated error
        threshold is met (or the recursion limit limit is reached).
      </p>

      <h3>Sampling depth</h3>

      <p>
        To force more subdivisions (and therefore improve quality), the{" "}
        <code>minSamplingDepth</code> and <code>maxSamplingDepth</code>
        props can be tuned. Increasing <code>minSamplingDepth</code> can help when you want to
        ensure more subdivisions and improve accuracy, and lowering <code>maxSamplingDepth</code>{" "}
        can help improve performance. These two props should be tuned to meet your needs.
      </p>

      <p>
        Here's an example of a common "stress test" function for plotters, sin(1/x). The top plot
        has the default sampling depths, while the bottom has <code>minSamplingDepth</code>{" "}
        increased to <code>15</code>. Neither approach is perfect, but the bottom render is
        indistinguishable from a perfect plot.
      </p>

      <CodeAndExample component={<SineStressTest />} source={SineStressTestSource} />
    </>
  )
}

export default Functions
