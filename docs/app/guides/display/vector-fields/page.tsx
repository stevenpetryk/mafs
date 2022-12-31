    "use client"

    import CodeAndExample from "components/CodeAndExample"

import VectorFieldExample from "guide-examples/VectorFieldExample"
import VectorFieldExampleSource from "!raw-loader!guide-examples/VectorFieldExample"

function Vectors() {
  return (
    <>
      <p>
        Vector fields take a function that is passed a point{" "}
        <span className="font-display italic">(x, y)</span> and returns a vector at that point.
        Vectors are then artificially scaled down (for legibility) and plotted on the coordinate
        plane. You must also pass a <code>step</code> to indicate how dense the vector field is.
      </p>

      <CodeAndExample component={<VectorFieldExample />} source={VectorFieldExampleSource} />
    </>
  )
}

export default Vectors

