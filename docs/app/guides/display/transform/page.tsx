import SimpleTransformExample from "guide-examples/utility/SimpleTransform"
import CodeAndExample from "components/CodeAndExample"
import Code from "components/Code"
import { PropTable } from "components/PropTable"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transform",
}

export default function Page() {
  return (
    <>
      <p>
        Sometimes it can be useful to apply 2D transformations to one or more components
        collectively. This is where <code>Transform</code> comes in handy.
      </p>

      <CodeAndExample example={SimpleTransformExample} />

      <PropTable of={"Transform"} />

      <h2>Transformation types</h2>

      <p>
        <code>Transform</code> supports many transformation convenience props, but they all boil
        down to matrix multiplication.
      </p>

      <p>
        You can pass your own matrix via the <code>matrix</code> prop and it will be combined with
        any other transformations you define. Use <code>vec.matrixBuilder()</code> to construct such
        a matrix if needed.
      </p>

      <h3>Nesting</h3>

      <p>
        Nesting is supported. Transformations will be applied <em>inside out</em>, so the innermost{" "}
        <code>Transform</code> will be applied first.
      </p>

      <Code
        language="tsx"
        source={`
          <Transform translate={[10, 10]}>
            <Transform rotate={Math.PI / 2}>
              {/* Things in here will be rotated, _then_ translated */}
            </Transform>
          </Transform>
        `}
      />

      <h3>Prop order matters</h3>

      <p>
        Though it's not typical for prop order in React to be significant, it is for{" "}
        <code>Transform</code>. Transformations will be applied in the order the props are set on
        the component, with the exception of <code>matrix</code> which always comes first.
      </p>

      <h2>Exceptions</h2>

      <p>
        Not all elements support <code>Transform</code>. This may change in the future.
      </p>

      <ul>
        <li>
          Text nodes have their <em>anchor points</em> transformed, but not the text itself.
        </li>

        <li>
          <code>Coordinates.*</code> cannot be transformed.
        </li>

        <li>
          <code>Function.OfX</code> cannot be transformed.
        </li>

        <li>
          <code>VectorField</code> cannot be transformed.
        </li>
      </ul>
    </>
  )
}
