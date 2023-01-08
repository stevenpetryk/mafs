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
        These <code>Plot</code> components are not a computer algebra system (CAS). They use
        numerical methods for evaluating a function and attempting to plot it accurately—which works
        well for most functions is far from perfect. Plots evaluate functions by recursively
        subdividing the domain until an estimated error threshold is met (or the recursion limit
        limit is reached).
      </p>

      <h3>Sampling depth</h3>

      <p>
        To force more subdivisions (and therefore improve quality), the{" "}
        <code>minSamplingDepth</code>
        prop can be tuned. By default, it's set to <code>10</code>, which means Mafs will never
        generate more than 2¹⁰ = 1024 points for a given evaluation window. This number can be
        increased to force improved quality at an exponential cost to performance.
      </p>

      <p>
        Here's an example of a common "stress test" function for plotters, sin(1/x). The top
        function has the default sampling depth, while the bottom has the sampling depth increased
        to <code>13</code>. Neither approach is perfect, but the bottom render is indistinguishable
        from a perfect plot.
      </p>

      <CodeAndExample component={<SineStressTest />} source={SineStressTestSource} />
    </>
  )
}

export default Functions
