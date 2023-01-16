"use client"

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
        In learning this, we'll eventually make a <code>PizzaSlice</code> component that behaves
        just like a built-in Mafs component.
      </p>

      <PizzaMarch />
    </>
  )
}
