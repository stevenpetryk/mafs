"use client"

import CodeAndExample from "components/CodeAndExample"
import { PropTable } from "components/PropTable"
import { Coordinates } from "mafs"

import CartesianCoordinatesExampleSource from "!raw-loader!guide-examples/display/coordinates/CartesianCoordinatesExample"
import CartesianCoordinatesExample from "guide-examples/display/coordinates/CartesianCoordinatesExample"

import CartesianCoordinatesConfigExampleSource from "!raw-loader!guide-examples/display/coordinates/CartesianCoordinatesConfigExample"
import Code from "components/Code"
import CartesianCoordinatesConfigExample from "guide-examples/display/coordinates/CartesianCoordinatesConfigExample"

import PolarCoordinatesExampleSource from "!raw-loader!guide-examples/display/coordinates/PolarCoordinatesExample"
import PolarCoordinatesExample from "guide-examples/display/coordinates/PolarCoordinatesExample"

import CartesianDotCoordinatesExampleSource from "!raw-loader!guide-examples/display/coordinates/CartesianDotCoordinatesExample"
import CartesianDotCoordinatesExample from "guide-examples/display/coordinates/CartesianDotCoordinatesExample"

function CoordinatesPage() {
  return (
    <>
      <p>
        Coordinates overlay a grid of lines on top of the Mafs canvas to give a sense of scale. Axes
        are pretty configurable—the spacing between lines, number of subdivisions, and the labels
        themselves can be altered.
      </p>

      <Code source={`import { Coordinates } from "mafs"`} language="tsx" />

      <h2>Cartesian coordinates</h2>

      <CodeAndExample
        component={<CartesianCoordinatesExample />}
        source={CartesianCoordinatesExampleSource}
      />

      <PropTable of={Coordinates.Cartesian} />

      <h3>Axis options</h3>

      <p>
        Each axis—<code>xAxis</code> and <code>yAxis</code>—can be configured with the following
        options:
      </p>

      <ul>
        <li>
          <code>axis</code>: Whether to draw the axis line.
        </li>
        <li>
          <code>lines</code>: The spacing between each primary line orthogonal to the axis, or{" "}
          <code>false</code> to draw none.
        </li>
        <li>
          <code>subdivisions</code>: How many subdivisions to draw per line, or <code>false</code>{" "}
          to draw none.
        </li>
        <li>
          <code>labels</code>: A function that returns a label for each line.
        </li>
      </ul>

      <p>
        The entire axis can also be set to <code>false</code> to disable it entirely.
      </p>

      <p>
        Mafs also exports a helper function, <code>labelPi</code>, which can be passed to{" "}
        <code>labels</code> to render in terms of π.
      </p>

      <CodeAndExample
        component={<CartesianCoordinatesConfigExample />}
        source={CartesianCoordinatesConfigExampleSource}
      />

      <h2>Dot coordinates</h2>

      <CodeAndExample
        component={<CartesianDotCoordinatesExample />}
        source={CartesianDotCoordinatesExampleSource}
      />

      <h2>Polar coordinates</h2>

      <CodeAndExample
        component={<PolarCoordinatesExample />}
        source={PolarCoordinatesExampleSource}
      />

      <PropTable of={Coordinates.Polar} />

      <h3>Axis options</h3>

      <p>
        Polar coordinates take most of the same options as cartesian coordinates, except that{" "}
        <code>lines</code> and <code>subdivisions</code> affects the radial rather than the{" "}
        <code>x</code> and <code>y</code> axes.
      </p>
    </>
  )
}

export default CoordinatesPage
