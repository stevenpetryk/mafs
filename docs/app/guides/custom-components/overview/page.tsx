"use client"
import Link from "next/link"

import PizzaMarch from "guide-examples/custom/pizza-march"

export default function CustomPage() {
  return (
    <>
      <p>
        Sometimes, Mafs simply won't have the component you need. When that happens, Mafs provides
        APIs to drop one level deeper, letting you render any SVG elements you want. All it takes is
        some work to ensure things render correctly.
      </p>

      <p>
        In learning this, we're going to explore multiple ways of making a <code>PizzaSlice</code>{" "}
        component that behaves just like a built-in Mafs component.
      </p>

      <PizzaMarch />

      <h2>At a glance</h2>

      <p>
        At its core, Mafs is just SVG with some transforms. Those transforms come from two places:
      </p>

      <ul>
        <li>
          The <strong>user transform</strong>, which is imposed by the{" "}
          <Link href="/guides/display/transform">Transform</Link> component.
        </li>
        <li>
          The <strong>view transform</strong>, which maps from "math space" to pixel space.
        </li>
      </ul>
    </>
  )
}
