"use client"

import Code from "../../../../components/Code"
import endent from "endent"
import CodeAndExample from "../../../../components/CodeAndExample"
import Plain from "../../../../components/guide-examples/hello-fx/plain"
import PlainSource from "!raw-loader!../../../../components/guide-examples/hello-fx/plain"

function Page() {
  return (
    <>
      <p>Install the package from NPM:</p>

      <Code
        language="bash"
        source={endent`
          yarn add mafs
          # or, if using NPM
          npm install --save mafs
        `}
      />

      <p>And then make sure to load the stylesheet:</p>

      <Code language="css" source={`@import "mafs/build/index.css";`} />

      <p>Now, in your React app, you should be able to render a Mafs view.</p>

      <CodeAndExample component={<Plain />} source={PlainSource} />

      <h2>Companion packages</h2>

      <p>
        Mafs is useful on its own, but can be made even better by using a few third-party libraries
        and assets.
      </p>

      <h3>Vector math</h3>

      <p>
        <a href="https://www.npmjs.com/package/vec-la">vec-la</a> is a tiny package to do vector
        math. It implements vectors using arrays, which is the same as what Mafs uses. In fact, Mafs
        uses the package internally for things like mapping from the Cartesian coordinate space to
        the pixel coordinate space.
      </p>

      <Code
        language="bash"
        source={endent`
          yarn add vec-la
          # or, if using NPM
          npm install --save vec-la
        `}
      />

      <h3>Fancy math font</h3>

      <p>
        The font in use on this site—Computer Modern Serif—does not ship with Mafs to avoid
        licensing problems. Mafs will inherit the body's font. You can{" "}
        <a href="https://www.checkmyworking.com/cm-web-fonts/">download Computer Modern webfonts</a>{" "}
        yourself to make it available on the page, then customize the Mafs font like this:
      </p>

      <Code
        language="css"
        source={endent`
            .MafsView {
              font-family: "Computer Modern Serif", serif;
            }
        `}
      />
    </>
  )
}

export default Page
