import PizzaSlice from "guide-examples/custom/pizza-slice"
import PointCloud from "guide-examples/custom/point-cloud"

import CodeAndExample from "components/CodeAndExample"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transform contexts",
}

export default function TransformContextsPage() {
  return (
    <>
      <p>
        At its core, Mafs is just SVG with two contextual transforms. Those transforms correspond to
        two things:
      </p>

      <ul>
        <li>
          The <strong>view transform</strong>, which maps from world space to pixel space.
        </li>
        <li>
          The <strong>user transform</strong>, which is imposed by the{" "}
          <Link href="/guides/display/transform">Transform</Link> component.
        </li>
      </ul>

      <p>
        The general approach is that, to render a point <code>(x, y)</code>, you must first apply
        the user transform (because, well, the user is trying to move your component in some way),
        and <em>then</em> the view transform (so that it gets rendered by the SVG renderer in the
        right spot).
      </p>

      <p>Mafs provides these transforms through two means:</p>

      <ul>
        <li>
          The <code>--mafs-view-transform</code> and <code>--mafs-user-transform</code> CSS custom
          properties, which can be applied to an SVG element's <code>style</code> attribute.
        </li>
        <li>
          The <code>useTransformContext</code> hook, which returns an object containing the{" "}
          <code>viewTransform</code> matrix and the <code>userTransform</code> matrix.
        </li>
      </ul>

      <p>
        Components can mix and match these two approaches depending on needs. For example, the{" "}
        <Link href="/guides/display/text">Text</Link> component transforms its <em>anchor point</em>{" "}
        in JavaScript, and doesn't apply any CSS transforms, because that would distort the text
        itself. On the other hand, the <Link href="/guides/display/ellipses">Ellipse</Link>{" "}
        component almost entirely relies on CSS transforms internally.
      </p>

      <h2>Accessing transforms in CSS</h2>

      <p>
        Here's an example of a custom component that uses the CSS transforms approach to render a
        delicious little <code>PizzaSlice</code>. The slice is wrapped in{" "}
        <code>Debug.TransformWidget</code> component so that you can try applying some user
        transforms it.
      </p>

      <CodeAndExample example={PizzaSlice} />

      <p>
        This is an example of a component that gets entirely transformed by the user and view
        transforms. The pizza slice can end up totally distorted. For cases where you want to
        preserve the aspect ratio or pixel size of your component, you likely need to use the hooks
        approach.
      </p>

      <h2>Accessing transforms in JavaScript</h2>

      <p>
        Here's an example of a custom component that uses the hooks approach to render a grid of
        points. Because we want the grid's points to have a radius of 3 <em>pixels</em> (regardless
        of the viewport or any transforms), we use the <code>useTransformContext</code> hook to get
        the user and view transforms and apply them to the circles' <code>x</code> and{" "}
        <code>y</code> coordinates, but not to their radius (which is in pixels). We also cannot use
        the CSS transforms approach here, because that would distort each circle.
      </p>

      <CodeAndExample example={PointCloud} />
    </>
  )
}
