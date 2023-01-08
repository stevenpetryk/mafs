import Link from "next/link"
import endent from "endent"

import Code from "components/Code"

function Vectors() {
  return (
    <>
      <p>
        Vector fields now live in the <Link href="/guides/display/plots">Plot</Link> namespace.
      </p>

      <Code
        language="diff"
        source={endent`
          -import { VectorField } from "mafs"
          +import { Plot } from "mafs"

          -<VectorField ... />
          +<Plot.VectorField ... />
        `}
      />

      <p>
        <Link href="/guides/display/plots">View the Plot docs →</Link>
      </p>
    </>
  )
}

export default Vectors
