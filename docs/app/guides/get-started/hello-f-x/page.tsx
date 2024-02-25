import CodeAndExample from "components/CodeAndExample"

import Plain from "guide-examples/hello-fx/plain"
import Subdivions from "guide-examples/hello-fx/subdivisions"
import Sine from "guide-examples/hello-fx/sine"
import SinePi from "guide-examples/hello-fx/sine-pi"
import Draggable from "guide-examples/hello-fx/draggable"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hello f(x)",
}

function Page() {
  return (
    <>
      <p>
        Documentation often starts with &ldquo;Hello, world&rdquo;. For this library, the equivalent
        example is rendering a function on the coordinate plane and making it a little bit
        interactive.
      </p>

      <h2>Drawing a coordinate plane</h2>

      <p>
        Mafs only needs a few components to set up a working coordinate plane view. We'll start with
        the same setup we had in &ldquo;Installation&rdquo;—just a Cartesian coordinate plane with
        nothing too interesting on it.
      </p>

      <CodeAndExample collapsible={false} example={Plain} />

      <p>
        <code>CartesianCoordinates</code> is pretty customizable. Let's make our graph a little bit
        more sophisticated-looking by adding some subdivisions.
      </p>

      <CodeAndExample collapsible={false} example={Subdivions} />

      <h2>Plotting a function</h2>

      <p>
        Plotting a function works by passing a literal JavaScript function. Let's plot{" "}
        <code>Math.sin(x)</code>.
      </p>

      <CodeAndExample collapsible={false} example={Sine} />

      <p>
        We've passed a plain JavaScript function, and Mafs evaluated it and plotted it across the
        coordinate plane.
      </p>

      <p>
        This looks a little weird though: sine waves are periodic in π, so it'd be nice to reflect
        that in our coordinate plane. Let's do the following:
      </p>

      <ul>
        <li>Tell the x-axis to draw a line at every multiple of π</li>
        <li>Label the x-axis in terms of π</li>
        <li>Zoom the x-axis out a bit</li>
        <li>Zoom the y-axis in a bit</li>
        <li>Tell Mafs to let us squish the viewport</li>
      </ul>

      <CodeAndExample collapsible={false} example={SinePi} />

      <p>
        At this point, it's worth noting that you haven't <em>instructed</em> the library to do
        anything—you've just declared what you want on the screen. This model of programming is core
        to React, and also core to this library.
      </p>

      <h2>Making things interactive</h2>

      <p>
        If you imagine holding what you've just built in your hands, it would feel only natural to
        slide the wave back and forth to adjust the phase. Let's add a movable point and hook it up
        to our function.
      </p>

      <CodeAndExample collapsible={false} example={Draggable} />

      <p>
        There are a few noteworthy things here: one is how we declared our point. We start centered
        on the origin, but constrain the motion of the point horizontally.
      </p>

      <p>
        Also worth noting is how we subtracted <code>phase.x</code> from the <code>x</code> in our
        sine function. This is just math—we're moving our wave side-to-side based on the point's
        position.
      </p>

      <p>
        Lastly, we draw <code>{"{phase.element}"}</code> on the view, which renders the actual
        point. We place it last so that it gets rendered above our function.
      </p>

      <h2>Up next</h2>

      <p>
        The remainder of these guides are more specific: they cover components you can add to your
        visualization. The rest is up to you and your imagination. The examples on this site might
        provide some inspiration, though.
      </p>
    </>
  )
}

export default Page
