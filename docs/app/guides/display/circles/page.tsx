import CodeAndExample from "components/CodeAndExample"

import * as MovableCircle from "guide-examples/MovableCircle"

import { PropTable } from "components/PropTable"

export default function Page() {
  return (
    <>
      <p>Circles take a center vector and a radius.</p>

      <CodeAndExample example={MovableCircle} />

      <PropTable of={"Circle"} />
    </>
  )
}
