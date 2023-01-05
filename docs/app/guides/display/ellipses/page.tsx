"use client"
import CodeAndExample from "components/CodeAndExample"

import MovableEllipse from "guide-examples/MovableEllipse"
import MovableEllipseSource from "!raw-loader!guide-examples/MovableEllipse"
import WIP from "components/WIP"
import Link from "next/link"

import { Ellipse } from "mafs"
import { PropTable } from "components/PropTable"

export default function Page() {
  return (
    <>
      <p>Ellipses take a center vector, radius vector, and an angle.</p>

      <CodeAndExample component={<MovableEllipse />} source={MovableEllipseSource} />

      <PropTable of={Ellipse} />

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
