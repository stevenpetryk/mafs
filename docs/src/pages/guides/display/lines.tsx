import React, { useEffect } from "react"
import GuidesLayout from "layouts/GuidesLayout"
import { Guide } from "guide"
import { CartesianCoordinates, Line, Mafs, useMovablePoint, useStopwatch } from "mafs"

export const frontmatter: Guide = {
  title: "Lines",
  order: 10,
}

const Lines: React.VFC = () => {
  const p1 = useMovablePoint([-1, -1])
  const p2 = useMovablePoint([2, 1])

  const p3 = useMovablePoint([-1, -1])
  const slope = useMovablePoint([0, 1], { constrain: "vertical" })

  const p4 = useMovablePoint([-1, -1])
  const { time: angle, start } = useStopwatch()
  useEffect(() => start(), [start])

  return (
    <GuidesLayout title={frontmatter.title}>
      <p>There are a few components for lines, depending on how you want to construct them.</p>

      <h2>Line through two points</h2>

      <Mafs>
        <CartesianCoordinates />
        <Line.ThroughPoints point1={[p1.x, p1.y]} point2={[p2.x, p2.y]} />
        {p1.element}
        {p2.element}
      </Mafs>

      <h2>Point and slope</h2>

      <Mafs>
        <CartesianCoordinates />
        <Line.PointSlope point={[p3.x, p3.y]} slope={slope.y} />
        {p3.element}
        {slope.element}
      </Mafs>

      <h2>Point and angle</h2>

      <Mafs>
        <CartesianCoordinates />
        <Line.PointAngle point={[p4.x, p4.y]} angle={angle} />
        {p4.element}
      </Mafs>
    </GuidesLayout>
  )
}

export default Lines
