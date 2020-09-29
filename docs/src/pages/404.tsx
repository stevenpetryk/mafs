import React from "react"
import { Link } from "gatsby"
import { Mafs, FunctionGraph, CartesianCoordinates } from "mafs"

import DefaultLayout from "layouts/DefaultLayout"

const Error404Page: React.VFC = () => (
  <DefaultLayout title="Page not found">
    <div className="prose text-center max-w-xl mx-auto space-y-6 my-12 px-6">
      <h1 className="text-5xl font-normal font-display">Page not found</h1>

      <p>
        Maybe you can find what you're looking for in the{" "}
        <Link to="/guides/get-started/installation/">Guides</Link> section?
      </p>

      <Mafs height={400}>
        <CartesianCoordinates
          xAxis={{ labels: false, axis: false }}
          yAxis={{ labels: false, axis: false }}
        />
        <FunctionGraph.Parametric
          xy={(t) => [0.8 * Math.cos(t) - 2, 0.8 * Math.sin(t) + 1]}
          t={[0, Math.PI * 2]}
        />
        <FunctionGraph.Parametric
          xy={(t) => [0.8 * Math.cos(t) + 2, 0.8 * Math.sin(t) + 1]}
          t={[0, Math.PI * 2]}
        />

        <FunctionGraph.Parametric xy={(t) => [t, -((t / 5) ** 2) - 2]} t={[-4, 4]} />
      </Mafs>

      <p>
        If you think there should be something at this URL, please{" "}
        <a href="https://github.com/stevenpetryk/mafs/issues/new">open an issue</a>.
      </p>
    </div>
  </DefaultLayout>
)

export default Error404Page
