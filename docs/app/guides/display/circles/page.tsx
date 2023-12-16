"use client"
import CodeAndExample from "components/CodeAndExample"

import MovableCircle from "guide-examples/MovableCircle"
import MovableCircleSource from "!raw-loader!guide-examples/MovableCircle"

import { PropTable } from "components/PropTable"
import { Circle } from "mafs"

export default function Page() {
  return (
    <>
      <p>Circles take a center vector and a radius.</p>

      <CodeAndExample component={<MovableCircle />} source={MovableCircleSource} />

      <PropTable of={"Circle"} />
    </>
  )
}
