"use client"
import CodeAndExample from "components/CodeAndExample"

import MovableEllipse from "guide-examples/MovableEllipse"
import MovableEllipseSource from "!raw-loader!guide-examples/MovableEllipse"
import MovableCircle from "guide-examples/MovableCircle"
import MovableCircleSource from "!raw-loader!guide-examples/MovableCircle"
import WIP from "components/WIP"
import Link from "next/link"

export default function Page() {
  return (
    <>
      <p>
        Ellipses take a center vector, radius vector, and an angle. Note that if the coordinate
        plane is not square (if the aspect ratio is "squished"), ellipses undergo a sort of
        funny-looking shear, which can make visualizations confusing.
      </p>

      <CodeAndExample component={<MovableEllipse />} source={MovableEllipseSource} />

      <WIP>
        <p>
          Support for defining ellipses in terms of two foci is planned. In the meantime, you can
          accomplish this using a{" "}
          <Link href="/guides/display/function-graphs/">parametric function</Link>.
        </p>
      </WIP>

      <h2>Circles</h2>

      <p>
        Circles have the same interface as Ellipses, but take a single value for their radius and
        don't take an angle.
      </p>

      <CodeAndExample component={<MovableCircle />} source={MovableCircleSource} />
    </>
  )
}
