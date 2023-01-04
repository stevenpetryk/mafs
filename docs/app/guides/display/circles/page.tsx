"use client"
import CodeAndExample from "components/CodeAndExample"

import MovableEllipse from "guide-examples/MovableEllipse"
import MovableEllipseSource from "!raw-loader!guide-examples/MovableEllipse"
import MovableCircle from "guide-examples/MovableCircle"
import MovableCircleSource from "!raw-loader!guide-examples/MovableCircle"
import WIP from "components/WIP"
import Link from "next/link"

import { Circle, Ellipse } from "mafs"
import { PropTable } from "components/PropTable"

export default function Page() {
  return (
    <>
      <p>Circles take a center vector and a radius.</p>

      <CodeAndExample component={<MovableCircle />} source={MovableCircleSource} />

      <h2>Props</h2>

      <PropTable info={(Circle as any).__docgenInfo} />
    </>
  )
}
