import CodeAndExample from "components/CodeAndExample"

import MovableEllipse from "guide-examples/MovableEllipse"
import WIP from "components/WIP"
import Link from "next/link"

import { PropTable } from "components/PropTable"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ellipses",
}

export default function Page() {
  return (
    <>
      <p>Ellipses take a center vector, radius vector, and an angle.</p>

      <CodeAndExample example={MovableEllipse} />

      <PropTable of={"Ellipse"} />

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
