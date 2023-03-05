"use client"

import CodeAndExample from "components/CodeAndExample"

import OfXAndY from "guide-examples/plots/of-x-and-y"
import OfXAndYSource from "!raw-loader!guide-examples/plots/of-x-and-y.tsx"

import TwistyBoi from "guide-examples/plots/twisty-boi"
import TwistyBoiSource from "!raw-loader!guide-examples/plots/twisty-boi.tsx"

import VectorFieldExample from "guide-examples/VectorFieldExample"
import VectorFieldExampleSource from "!raw-loader!guide-examples/VectorFieldExample"

import SineStressTest from "guide-examples/plots/sine-stress-test"
import SineStressTestSource from "!raw-loader!guide-examples/plots/sine-stress-test.tsx"

import { PropTable } from "components/PropTable"
import { Plot } from "mafs"
import InequalitiesExample from "guide-examples/plots/inequalities"
import InequalitiesExampleSource from "!raw-loader!guide-examples/plots/inequalities.tsx"

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
      <PropTable of={Plot.OfX} />
      <PropTable of={Plot.OfY} />

      <h2>
        Inequalities of <em className="font-display">x</em> and <em className="font-display">y</em>
      </h2>

      <p>
        Inequalities represent the region less than or greater than one or two functions. Mafs
        allows you to plot the region between two functions, or a function and a constant. The
        inequality can be a function of <em className="font-display">x</em> or{" "}
        <em className="font-display">y</em>.
      </p>

      <p>
        You cannot provide an <code>x</code> and a <code>y</code> prop to Inequality—it will throw a
        runtime exception. Similarly, you cannot pass conflicting inequality operators—like both{" "}
        <code>&lt;</code> <em>and</em> <code>≤</code>.
      </p>

      <CodeAndExample component={<InequalitiesExample />} source={InequalitiesExampleSource} />
      <PropTable of={Plot.Inequality} />

      <h2>Parametric functions</h2>
      <CodeAndExample component={<TwistyBoi />} source={TwistyBoiSource} />
      <PropTable of={Plot.Parametric} />

      <h2>Vector fields</h2>

      <p>
        Vector fields take a function that is passed a point <code>[x, y]</code> and returns a
        vector at that point. Vectors are then artificially scaled down (for legibility) and plotted
        on the coordinate plane. You must also pass a <code>step</code> to indicate how dense the
        vector field is.
      </p>

      <CodeAndExample component={<VectorFieldExample />} source={VectorFieldExampleSource} />
      <PropTable of={Plot.VectorField} />

      <h2>Render quality</h2>

      <h3>Function sampling</h3>

      <p>
        <code>Plot.OfX</code>, <code>Plot.OfY</code>, and <code>Plot.Parametric</code> use numerical
        methods for evaluating a function and attempting to plot it accurately. The approach works
        well for most functions, but it's far from perfect.
      </p>

      <p>
        Mafs samples functions by by recursively subdividing the domain until an estimated error
        threshold is met (or the recursion limit limit is reached).
      </p>

      <h4>Sampling depth</h4>

      <p>
        To force more subdivisions (and therefore improve quality), the{" "}
        <code>minSamplingDepth</code> and <code>maxSamplingDepth</code> props can be tuned.
        Increasing <code>minSamplingDepth</code> can help when you want to ensure more subdivisions
        and improve accuracy, and lowering <code>maxSamplingDepth</code> can help improve
        performance. These two props should be tuned to meet your needs.
      </p>

      <p>
        Here's an example of a common "stress test" function for plotters, sin(1/x). The top plot
        has the default sampling depths, while the bottom has <code>minSamplingDepth</code>{" "}
        increased to <code>15</code>. Neither approach is perfect, but the bottom render is
        indistinguishable from a perfect plot.
      </p>

      <CodeAndExample component={<SineStressTest />} source={SineStressTestSource} />

      <h3>Vector fields</h3>

      <p>
        Vector field rendering quality can be tuned with the <code>step</code> prop. This declares
        the spacing between arrows, so lowering it will decrease performance.
      </p>
    </>
  )
}

export default Functions
