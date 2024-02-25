import Code from "components/Code"
import CodeAndExample from "components/CodeAndExample"

import Plain from "guide-examples/hello-fx/plain"
import endent from "endent"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Installation",
}

function Page() {
  return (
    <>
      <p>Install the package from NPM:</p>

      <Code
        language="bash"
        source={`
          yarn add mafs
          # or, if using NPM
          npm install --save mafs
        `}
      />

      <p>And then make sure to load the stylesheet.</p>

      <Code
        language="css"
        source={endent`
          @import "mafs/core.css";
        `}
      />

      <p>Now, in your React app, you should be able to render a Mafs view.</p>

      <CodeAndExample example={Plain} />

      <h2>Fancy math font</h2>

      <p>
        The font in use on this site (Computer Modern Serif) can be used with Mafs by importing{" "}
        <code>mafs/font.css</code>. It will import the appropriate font files and set Mafs'
        font-family.
      </p>

      <Code
        language="css"
        source={`
          @import "mafs/core.css";
          @import "mafs/font.css";
        `}
      />

      <p>
        Computer Modern looks great, but it comes at a cost: using it will add about 220kB to your
        page load.
      </p>
    </>
  )
}

export default Page
