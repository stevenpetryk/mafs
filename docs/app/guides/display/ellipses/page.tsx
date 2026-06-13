import CodeAndExample from "components/CodeAndExample"

import MovableEllipseCenter from "guide-examples/MovableEllipse/Center"
import MovableEllipseSemiMajorAxis from "guide-examples/MovableEllipse/SemiMajorAxis"
import MovableEllipseSemiMinorAxis from "guide-examples/MovableEllipse/SemiMinorAxis"
import MovableEllipseEccentricity from "guide-examples/MovableEllipse/Eccentricity"
import Link from "next/link"

import { PropTable } from "components/PropTable"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ellipses",
}

export default function Page() {
  return (
    <>
      <p>There are a few components for ellipses, depending on how you want to construct them.</p>
      <h2>Center, Radii and Angle</h2>
      <p>Ellipses take a center vector, radius vector, and an angle.</p>

      <CodeAndExample example={MovableEllipseCenter} />

      <PropTable of={"Ellipse.Center"} />

      <h2>Ellipse with two foci</h2>
      <p>There are a few ways to define an ellipse with two foci.</p>
      <h3>Semi-Major Axis</h3>
      <p>Ellipses take 2 foci and a Semi-Major Axis.</p>

      <CodeAndExample example={MovableEllipseSemiMajorAxis}/>

      <h3>Semi-Minor Axis</h3>
      <p>Ellipses take 2 foci and a Semi-Minor Axis.</p>

      <CodeAndExample example={MovableEllipseSemiMinorAxis}/>
      <h3>Eccentricity</h3>
      <p>Ellipses take 2 foci and an eccentricity between 0 and 1.</p>

      <CodeAndExample example={MovableEllipseEccentricity}/>
    </>
  )
}
