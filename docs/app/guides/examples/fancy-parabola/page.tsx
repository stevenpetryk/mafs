import CodeAndExample from "components/CodeAndExample"
import FancyParabola from "guide-examples/examples/FancyParabola"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fancy parabola",
}

export default function ProjectilePage() {
  return (
    <>
      <p></p>

      <CodeAndExample example={FancyParabola} />
    </>
  )
}
