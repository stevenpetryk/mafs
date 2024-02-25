import CodeAndExample from "components/CodeAndExample"
import { PropTable } from "components/PropTable"

import LatexExample from "components/guide-examples/display/Latex"
import LatexDocExample from "components/guide-examples/display/LatexDoc"

import Link from "next/link"
import Experimental from "components/Experimental"
import Code from "components/Code"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LaTeX",
}

export default function LatexPage() {
  return (
    <>
      <p>
        This is a wrapper around{" "}
        <Link href="https://katex.org/" target="_blank">
          KaTeX
        </Link>{" "}
        that allows you to embed LaTeX expressions directly in Mafs. It supports passing a{" "}
        <code>tex</code> raw string and{" "}
        <Link href="https://katex.org/docs/options.html" target="_blank">
          all KaTeX options
        </Link>
        . A particularly useful option is <code>macros</code>, which allow you to define reusable
        LaTeX macros.
      </p>

      <Experimental>
        This component does not work properly in Safari due to some quirks with how WebKit handles
        the SVG foreignObject element.
      </Experimental>

      <PropTable of={"LaTeX"} />

      <h2>Usage</h2>

      <p>
        Since LaTeX is a wrapper around KaTeX, you must import KaTeX's CSS for it to render
        properly. The specific import path may differ depending on your app's underlying
        configuration. In the future, this may change to be an import like{" "}
        <code>mafs/latex.css</code>.
      </p>

      <Code language="css" source={`@import "katex/dist/katex.min.css";`} />

      <h2>Examples</h2>

      <p>
        The example below utilize{" "}
        <Link href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw">
          String.raw
        </Link>{" "}
        to avoid having to escape backslashes, but as <Link href="">noted in the KaTeX docs</Link>,{" "}
        <code>\x</code>, <code>\u</code>, and <code>{"\\{"}</code> still require escaping (hence the{" "}
        <code>x</code> variable in the following code).
      </p>

      <CodeAndExample example={LatexExample} />
      <CodeAndExample example={LatexDocExample} />
    </>
  )
}
