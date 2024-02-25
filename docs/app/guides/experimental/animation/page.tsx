import WIP from "components/WIP"
import CodeAndExample from "components/CodeAndExample"

import AnimatedPoint from "guide-examples/animation/AnimatedPoint"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Animation",
}

function Stopwatch() {
  return (
    <>
      <p>
        <code>useStopwatch</code> allows you to start and stop a real-time clock for doing neat
        things like physics simulations.
      </p>

      <p>
        Pass <code>startTime</code> (defaults to 0) or <code>endTime</code> (defaults to Infinity)
        to constrain the stopwatch.
      </p>

      <WIP>
        <p>
          Animation is quite underdeveloped in this library both from a performance and feature
          standpoint. It could use things like keyframing, easing, and sequencing.
        </p>
      </WIP>

      <CodeAndExample example={AnimatedPoint} />
    </>
  )
}

export default Stopwatch
