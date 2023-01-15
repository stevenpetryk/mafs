"use client"
import Link from "next/link"

import CodeAndExample from "components/CodeAndExample"

import PlainSVGExample from "components/guide-examples/custom/plain-svg"
import PlainSVGExampleSource from "!raw-loader!components/guide-examples/custom/plain-svg"

export default function CustomPage() {
  return (
    <>
      <p>
        Sometimes, Mafs simply won't have the component you need. When that happens, there are two
        options:
      </p>

      <ul>
        <li>
          <Link href="https://github.com/stevenpetryk/mafs/issues">Open a feature request</Link>.
          There may already be an open issue for your use case.
        </li>
        <li>
          Write a <strong>custom Mafs component</strong>.
        </li>
      </ul>

      <h2>Building a custom component</h2>

      <p>
        Mafs is built on top of{" "}
        <Link href="https://developer.mozilla.org/en-US/docs/Web/SVG">
          SVG <span aria-hidden="true">↗</span>
        </Link>
        , meaning that you can use any SVG element inside of a Mafs component. However, there is a
        little bit more work required to make sure that your custom component works well with the
        rest of Mafs. Namely, we'll need to ensure the following:
      </p>

      <ul>
        <li>
          Graphics are rendered in the <em>coordinate space</em>.
        </li>

        <li>
          The component respects the <code>Transform</code> context.
        </li>

        <li>
          The component avoids rendering when it's not in view (optional, depending on performance
          needs).
        </li>
      </ul>

      <h3>Rendering in the coordinate space</h3>

      <p>
        SVG is based on <strong>pixels</strong>, whereas Mafs tries to work inside of a{" "}
        <strong>coordinate space</strong>. This causes a problem which can be illustrated by
        rendering a simple SVG <code>circle</code> inside of Mafs:
      </p>

      <CodeAndExample component={<PlainSVGExample />} source={PlainSVGExampleSource} />

      <p>
        The circle appears, and is roughly centered (thanks to the SVG{" "}
        <Link href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox">
          viewBox <span aria-hidden="true">↗</span>
        </Link>{" "}
        attribute), but it is <em>not</em> positioned at <code>(1, 0)</code> and it doesn't have a
        radius of <code>20</code> units. Instead, it's positioned at <code>(1px, 0px)</code> and is
        20 <em>pixels</em> in radius.
      </p>

      <p>Let's fix the scaling problem.</p>
    </>
  )
}
