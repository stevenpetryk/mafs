"use client"

import CodeAndExample from "components/CodeAndExample"

import Sine from "guide-examples/hello-fx/sine"
import SineSource from "!raw-loader!guide-examples/hello-fx/sine.tsx"
import Parametric from "guide-examples/Parametric"
import ParametricSource from "!raw-loader!guide-examples/Parametric.tsx"
import { PropTable } from "components/PropTable"
import { FunctionGraph } from "mafs"

function Functions() {
  return (
    <>
      {/* <h2>
        Functions of <em className="font-display">x</em>
      </h2> */}

      <CodeAndExample component={<Sine />} source={SineSource} />
      <PropTable of={FunctionGraph.OfX} displayName="FunctionGraph.OfX" />

      <h2>Parametric functions</h2>

      <CodeAndExample component={<Parametric />} source={ParametricSource} />
      <PropTable of={FunctionGraph.Parametric} displayName="FunctionGraph.Parametric" />
    </>
  )
}

export default Functions
