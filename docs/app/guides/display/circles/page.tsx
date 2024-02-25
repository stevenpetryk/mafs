import CodeAndExample from "components/CodeAndExample"

import MovableCircle from "guide-examples/MovableCircle"

import { PropTable } from "components/PropTable"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Circles",
}

export default function Page() {
  return (
    <>
      <p>Circles take a center vector and a radius.</p>

      <CodeAndExample example={MovableCircle} />

      <PropTable of={"Circle"} />
    </>
  )
}
