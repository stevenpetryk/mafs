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

      <p>
        A finite stopwatch can also be paused and resumed, restarted with <code>start</code> after
        it reaches its end, or moved to a key frame with <code>setTime</code>. Set{" "}
        <code>repeat</code> to loop, <code>reversed</code> to play from <code>endTime</code> down to{" "}
        <code>startTime</code>, and pass an <code>ease</code> function for normalized easing.
      </p>

      <p>
        The stopwatch reports time in seconds. When easing or reversing is enabled,{" "}
        <code>setTime</code> positions the underlying timeline and <code>time</code> reports the
        resulting displayed value. Use <code>rawTime</code> for a range input or other control that
        needs to stay locked to the underlying timeline.
      </p>

      <CodeAndExample example={AnimatedPoint} />
    </>
  )
}

export default Stopwatch
