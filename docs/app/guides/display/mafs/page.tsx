import CodeAndExample from "components/CodeAndExample"
import { PropTable } from "components/PropTable"

import PlainMafsExample from "guide-examples/PlainMafsExample"
import ContainViewboxExample from "guide-examples/display/viewbox/ContainViewbox"
import ZoomExample from "guide-examples/display/viewbox/ZoomExample"
import StretchViewboxExample from "guide-examples/display/viewbox/StretchViewbox"
import Code from "components/Code"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mafs",
}

function MafsPage() {
  return (
    <>
      <p>
        This component is the entrypoint into rendering visualizations. It must wrap all other Mafs
        components. On its own, it renders a blank canvas.
      </p>

      <CodeAndExample example={PlainMafsExample} />
      <PropTable of="Mafs" />

      <h2>Sizing</h2>

      <p>
        Mafs accepts a <code>width</code> and <code>height</code> prop. <code>width</code> defaults
        to <code>auto</code>, which means that Mafs will scale to the width of its container.{" "}
        <code>height</code> defaults to <code>500px</code>, and cannot be set to <code>"auto"</code>
        .
      </p>

      <h2>Zooming and panning</h2>

      <p>
        Mafs can be zoomed and panned by end users using a variety of input methods. Zooming and
        panning can be enabled, disabled, and configured via the <code>zoom</code> and{" "}
        <code>pan</code> props.
      </p>

      <ul>
        <li>The mouse wheel zooms the viewport.</li>
        <li>Pressing and dragging pans the viewport.</li>
        <li>The "pinch" gesture zooms and pans the viewport simultaneously.</li>
        <li>
          The arrow, <kbd>-</kbd>, and <kbd>+</kbd> keys pan and zoom the viewport, with the{" "}
          <kbd>option</kbd>, <kbd>meta</kbd>, and <kbd>shift</kbd> keys adjusting the speed.
        </li>
      </ul>

      <p>
        Panning is enabled by default, but zooming is opt-in. The default zoom limits are{" "}
        <code>0.5-5</code>
      </p>

      <CodeAndExample example={ZoomExample} />

      <h2>Viewbox</h2>

      <p>
        When showing a visualization, it's useful to think of your content as having a useful
        "viewbox" designating the region in which interesting things are happening. Mafs allows you
        to specify this with the <code>viewBox</code> prop.
      </p>

      <CodeAndExample example={ContainViewboxExample} />

      <h3>Aspect ratio preservation</h3>

      <p>
        The <code>preserveAspectRatio</code> prop changes how the viewbox is mapped to the Mafs
        viewport. Setting it to <code>false</code> will stretch the viewbox to fit the viewport,
        tossing aside the aspect ratio preservation.
      </p>

      <CodeAndExample example={StretchViewboxExample} />

      <p>
        The only other option is <code>"contain"</code> for now, which is also the default.
      </p>

      <h3>Padding</h3>

      <p>
        Mafs adds a padding of <code>0.5</code> to all visualizations by default. To change or
        remove padding, you can specify <code>padding</code> in the <code>viewBox</code> object.
      </p>

      <Code
        source={`
          <Mafs viewBox={{ ..., padding: 0 }}>
            {/* ... */}
          </Mafs>
        `}
        language="tsx"
      />
      <h2>Colors and themes</h2>

      <p>
        Mafs uses CSS custom properties for its built-in palette. Override them on{" "}
        <code>.MafsView</code> (or a parent element) after importing <code>mafs/core.css</code> to
        create a light theme or match your application. Components that accept a <code>color</code>
        prop can use the exported <code>Theme</code> values or any valid CSS color.
      </p>

      <Code
        language="css"
        source={[
          ".my-light-mafs {",
          "  --mafs-bg: #fff;",
          "  --mafs-fg: #172033;",
          "  --mafs-line-color: #cbd5e1;",
          "  --grid-line-subdivision-color: #e2e8f0;",
          "  --mafs-blue: #2563eb;",
          "}",
        ].join("\n")}
      />

      <p>
        The main variables are <code>--mafs-bg</code>, <code>--mafs-fg</code>,{" "}
        <code>--mafs-origin-color</code>, <code>--mafs-line-color</code>,{" "}
        <code>--grid-line-subdivision-color</code>, and the palette variables{" "}
        <code>--mafs-red</code>, <code>--mafs-orange</code>, <code>--mafs-yellow</code>,{" "}
        <code>--mafs-green</code>, <code>--mafs-blue</code>, <code>--mafs-indigo</code>,{" "}
        <code>--mafs-violet</code>, and <code>--mafs-pink</code>. The CSS variables are the source
        of truth, while <code>Theme</code> provides convenient references for component props.
      </p>

      <h2>Accessibility</h2>

      <p>
        Mafs keeps movable points keyboard-operable and gives the canvas a focus target when panning
        or zooming is enabled. For a complete accessible visualization, add a nearby text heading or
        description, keep the number of interactive points manageable, and provide a non-visual
        explanation or equivalent controls for important information. Custom SVG components should
        preserve keyboard focus, visible focus styles, and meaningful labels where appropriate.
      </p>
    </>
  )
}

export default MafsPage
