import CodeAndExample from "components/CodeAndExample"
import FancyParabola from "guide-examples/examples/FancyParabola"
import FancyParabolaSource from "!raw-loader!guide-examples/examples/FancyParabola.tsx"

export default function ProjectilePage() {
  return (
    <>
      <p></p>

      <CodeAndExample source={FancyParabolaSource} component={<FancyParabola />} />
    </>
  )
}
