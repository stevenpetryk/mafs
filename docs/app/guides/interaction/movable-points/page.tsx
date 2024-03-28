import CodeAndExample from "components/CodeAndExample"

import PointsAlongFunction from "guide-examples/display/PointsAlongFunction"
import DynamicMovablePoints from "guide-examples/display/DynamicMovablePoints"
import SnapPoint from "guide-examples/SnapPoint"

import { Advanced } from "components/Advanced"
import Code from "components/Code"
import Link from "next/link"
import { PropTable } from "components/PropTable"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Movable points",
}

function Stopwatch() {
  return (
    <>
      <p>
        Movable points can be dragged around the coordinate plane, or moved via the keyboard.
        They're the cornerstone of lots of interactions.
      </p>

      <p>
        They can be unconstrained (allowed to move freely), constrained horizontally or vertically,
        or constrained to an arbitrary function. This example constrains movement horizontally:
      </p>

      <CodeAndExample example={PointsAlongFunction} />

      <h2>Constraints</h2>

      <p>
        Beyond constraining horizontally or vertically, points can also be constrained to arbitrary
        paths. This is done by passing a function to <code>constrain</code>. The function is
        expected to take a point <span className="font-display italic">(x, y)</span>, which is where
        the user is <em>trying to move to</em>, and to return a new point,{" "}
        <span className="font-display italic">(x', y')</span>, which is where the point should{" "}
        <em>actually go</em>.
      </p>

      <p>
        To demonstrate this, imagine constraining a point to "snap" to the nearest whole number
        point. We take where the user is trying to move to, and round it to the nearest whole
        number.
      </p>

      <Code
        language="tsx"
        source={`
          useMovablePoint([0, 0], {
            constrain: ([x, y]) => [Math.round(x), Math.round(y)]
          })
        `}
      />

      <p>
        Another common use case is to constrain motion to be circular—<code>vec.withMag</code> comes
        in handy there.
      </p>

      <Code
        language="tsx"
        source={`
          useMovablePoint([0, 0], {
            // Constrain \`point\` to move in a circle of radius 1
            constrain: (point) => vec.withMag(point, 1)
          })
        `}
      />

      <p>
        You can also constrain a point to follow a straight line by setting <code>constrain</code>{" "}
        to <code>"horizontal"</code> or <code>"vertical"</code>.
      </p>

      <p>
        Mafs may call <code>constrain</code> more than once when the user moves a point using the
        arrow keys, so it should be side-effect free.
      </p>

      <h2>Transformations and constraints</h2>

      <p>
        When wrapping a Movable Point in a <Link href="/guides/utility/transform">Transform</Link>,
        the point will be transformed too. However, your <code>constrain</code> function will be
        passed the <em>untransformed</em> point, and its return value will be transformed{" "}
        <em>back</em> into the currently applied transform. In other words, Mafs takes care of the
        math for you.
      </p>

      <p>
        Let's see a more complex example where we combine more interesting constraint functions with
        transforms. On the left, we have a point that can only move in whole-number increments
        within a square, and on the right, a point that can only move in π/16 increments in a
        circle.
      </p>

      <CodeAndExample example={SnapPoint} />

      <h2 className="flex flex-col gap-1">
        <div>
          <Advanced />
        </div>
        <span>Using MovablePoint directly</span>
      </h2>

      <p>
        <code>useMovablePoint</code> is a hook that helps you instantiate and manage the state of a{" "}
        <code>MovablePoint</code>. However, if need be, you can also use <code>MovablePoint</code>{" "}
        directly. This can be useful if you need to work with a dynamic number of movable points
        (since the React "rules of hooks" ban you from dynamically calling hooks).
      </p>

      <CodeAndExample example={DynamicMovablePoints} />

      <PropTable of={"MovablePoint"} />
    </>
  )
}

export default Stopwatch
