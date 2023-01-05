"use client"

import { CartesianCoordinates } from "mafs"
import { PropTable } from "components/PropTable"
import CodeAndExample from "components/CodeAndExample"
import Link from "next/link"

import CartesianCoordinatesExample from "guide-examples/display/coordinates/CartesianCoordinatesExample"
import CartesianCoordinatesExampleSource from "!raw-loader!guide-examples/display/coordinates/CartesianCoordinatesExample"

import CartesianCoordinatesConfigExample from "guide-examples/display/coordinates/CartesianCoordinatesConfigExample"
import CartesianCoordinatesConfigExampleSource from "!raw-loader!guide-examples/display/coordinates/CartesianCoordinatesConfigExample"

function CoordinatesPage() {
  return (
    <>
      <p>
        Coordinates overlay a grid of lines on top of the Mafs canvas to give a sense of scale. Axes
        are pretty configurable—the spacing between lines, number of subdivisions, and the labels
        themselves can be altered.
      </p>

      <h2>Cartesian coordinates</h2>

      <CodeAndExample
        component={<CartesianCoordinatesExample />}
        source={CartesianCoordinatesExampleSource}
      />

      <PropTable of={CartesianCoordinates} />

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
        The entire axis can also be set to <code>false</code>to disable it entirely.
      </p>

      <p>
        Mafs also exports a helper function, <code>labelPi</code>, which can be passed to{" "}
        <code>labels</code> to render in terms of π.
      </p>

      <CodeAndExample
        component={<CartesianCoordinatesConfigExample />}
        source={CartesianCoordinatesConfigExampleSource}
      />

      <h2>Polar coordinates</h2>

      <p>
        Polar coordinates are not yet implemented in Mafs. There is an{" "}
        <Link href="https://github.com/stevenpetryk/mafs/issues/6" target="_blank">
          open issue for this
        </Link>
        .
      </p>
    </>
  )
}

export default CoordinatesPage
