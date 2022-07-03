import * as React from "react"
import GuidesLayout from "layouts/GuidesLayout"
import { Guide } from "guide"

import CodeAndExample from "components/CodeAndExample"

import PointsAlongFunction from "guide-examples/display/PointsAlongFunction"
import PointsAlongFunctionSource from "!raw-loader!guide-examples/display/PointsAlongFunction"
import DynamicMovablePoints from "guide-examples/display/DynamicMovablePoints"
import DynamicMovablePointsSource from "!raw-loader!guide-examples/display/DynamicMovablePoints"
import SnapPoint from "guide-examples/SnapPoint"
import SnapPointSource from "!raw-loader!guide-examples/SnapPoint"
import MovableEllipse from "guide-examples/MovableEllipse"
import MovableEllipseSource from "!raw-loader!guide-examples/MovableEllipse"
import { Advanced } from "components/Advanced"

export const frontmatter: Guide = {
  title: "Movable points",
  order: 0,
}

const Stopwatch: React.VFC = () => (
  <GuidesLayout title={frontmatter.title}>
    <p>
      Movable points can be dragged around the coordinate plane, or moved via the keyboard. They're
      the cornerstone of lots of interactions.
    </p>

    <p>
      They can be unconstrained (allowed to move freely), constrained horizontally or vertically, or
      constrained to an arbitrary function. This example constrains movement horizontally:
    </p>

    <CodeAndExample component={<PointsAlongFunction />} source={PointsAlongFunctionSource} />

    <h2>Constraints</h2>

    <p>
      Beyond constraining horizontally or vertically, points can also be constrained to arbitrary
      paths. This is done by passing a function to <code>constrain</code>. The function is expected
      to take a point <span className="font-display italic">(x, y)</span>, which is where the user
      is <em>trying to move to</em>, and to return a new point,{" "}
      <span className="font-display italic">(x', y')</span>, which is where the point should{" "}
      <em>actually go</em>.
    </p>

    <p>
      The simplest example of this is, in fact, constraining movement horizontally and vertically.
      When you pass <code>"horizontal"</code> or <code>"vertical"</code>, Mafs is internally using
      functions like this to constrain the point:
    </p>

    <ul>
      <li>
        Horizontal constraint: <code>{`([newX, _]) => [newX, y]`}</code>
      </li>
      <li>
        Vertical constraint: <code>{`([_, newY]) => [x, newY]`}</code>
      </li>
    </ul>

    <p>
      You can also round point positions to make points move discretely rather than continuously.
      The following example plays with that idea both for linear positions and angles.
    </p>

    <CodeAndExample component={<SnapPoint />} source={SnapPointSource} />

    <h2>Transforms</h2>

    <p>
      Transforms are a way to separate a point's visual location from its mathematical one. This is
      great if you want to define a point's position in terms of other points.
    </p>

    <p>
      When transforming a point, its constraints are also transformed—your <code>constraint</code>{" "}
      function, if any, will receive the point's <em>actual</em> position, not its visual one. This
      means that if you rotate a point using a transformation, and you've constrained the point
      horizontally (for example), the horizontal constraint will be rotated, too.
    </p>

    <p>
      This next example exploits this behavior to great effect. The center (orange) point is used to
      translate the other 3 points, so they "follow" the center point. Then, the outer (blue) point,
      which rotates the ellipse, applies a rotation to the width and height points. All along the
      way, every point can be treated as if it hasn't moved at all, keeping the math easy for us and
      letting Mafs do all the linear algebra.
    </p>

    <CodeAndExample component={<MovableEllipse />} source={MovableEllipseSource} />

    <h2 className="flex flex-col gap-1">
      <div>
        <Advanced />
      </div>
      <span>Using MovablePoint directly</span>
    </h2>

    <p>
      <code>useMovablePoint</code> is a hook that helps you instantiate and manage the state of a
      <code>MovablePoint</code>. However, if need be, you can also use <code>MovablePoint</code>{" "}
      directly. This can be useful if you need to work with a dynamic number of movable points
      (since the React "rules of hooks" ban you from dynamically calling hooks).
    </p>

    <CodeAndExample component={<DynamicMovablePoints />} source={DynamicMovablePointsSource} />
  </GuidesLayout>
)

export default Stopwatch
