"use client"
import CodeAndExample from "components/CodeAndExample"

import MovableEllipse from "guide-examples/MovableEllipse"
import MovableEllipseSource from "!raw-loader!guide-examples/MovableEllipse"
import MovableCircle from "guide-examples/MovableCircle"
import MovableCircleSource from "!raw-loader!guide-examples/MovableCircle"
import WIP from "components/WIP"
import Link from "next/link"

import { Circle, Ellipse } from "mafs"
import { PropTable } from "components/PropTable"

export default function Page() {
  return (
    <>
      <h2>Circles</h2>

      <p>Circles take a center vector and a radius.</p>

      <CodeAndExample component={<MovableCircle />} source={MovableCircleSource} />

      <h3>Props</h3>

      <PropTable info={(Circle as any).__docgenInfo} />

      <h2>Ellipses</h2>

      <p>Ellipses take a center vector, radius vector, and an angle.</p>

      <CodeAndExample component={<MovableEllipse />} source={MovableEllipseSource} />

      <h3>Props</h3>

      <PropTable info={(Ellipse as any).__docgenInfo} />

      <WIP>
        <p>
          Support for defining ellipses in terms of two foci is planned. In the meantime, you can
          accomplish this using a{" "}
          <Link href="/guides/display/function-graphs/">parametric function</Link>.
        </p>
      </WIP>
    </>
  )
}
