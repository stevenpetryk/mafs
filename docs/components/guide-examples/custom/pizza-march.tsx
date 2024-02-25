// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client"

import { range } from "lodash"
import {
  Mafs,
  Coordinates,
  Plot,
  useMovablePoint,
  Transform,
  useTransformContext,
  vec,
} from "mafs"

let inc = 0

function PizzaSlice({ at, radius: r }) {
  const [x, y] = at
  inc++

  const { userTransform } = useTransformContext()

  const userTransformCSS = vec.toCSS(userTransform)

  return (
    <g
      style={{
        transform: `var(--mafs-view-transform)`,
      }}
    >
      <defs>
        <mask
          id={`pizza-slice-mask-${inc}`}
          maskUnits="userSpaceOnUse"
        >
          <polyline
            id="pizza-slice"
            points={`0,0 ${r},${r / 2} ${r},${-r / 2}`}
            fill="white"
            stroke="none"
          />
        </mask>
      </defs>

      <g
        mask={`url(#pizza-slice-mask-${inc})`}
        transform={`translate(${x}, ${y}) ${userTransformCSS}`}
        maskContentUnits="userSpaceOnUse"
      >
        <circle cx={0} cy={0} r={r} fill="brown" />
        <circle cx={0} cy={0} r={r * 0.85} fill="yellow" />
        {/* prettier-ignore */}
        <circle cx={0 + r * 0.4} cy={0 + r*0.1} r={r * 0.11} fill="red" />
        {/* prettier-ignore */}
        <circle cx={0 + r * 0.2} cy={0 - r*0.1} r={r * 0.09} fill="red" />
        {/* prettier-ignore */}
        <circle cx={0 + r * 0.5} cy={0 - r*0.15} r={r * 0.1} fill="red" />
        {/* prettier-ignore */}
        <circle cx={0 + r * 0.70} cy={0 + r*0.05} r={r * 0.11} fill="red" />
        {/* prettier-ignore */}
        <circle cx={0 + r * 0.65} cy={0 + r*0.35} r={r * 0.1} fill="red" />
        {/* prettier-ignore */}
        <circle cx={0 + r * 0.65} cy={0 - r*0.37} r={r * 0.08} fill="red" />
      </g>
    </g>
  )
}

export default function Example() {
  const fn = (x) => Math.sin(x * 2)
  const deriv = (x) => 2 * Math.cos(x * 2)

  const offset = useMovablePoint([2, fn(2)], {
    constrain: ([x]) => [x, fn(x)],
  })

  const points = range(-4, 0.1, 1 / 2).map(
    (x) => [x + offset.x, fn(x + offset.x)] as const,
  )

  return (
    <Mafs height={300} viewBox={{ y: [-1, 1], x: [-3, 3] }}>
      <Coordinates.Cartesian />
      <Plot.OfX y={fn} />
      {points.map((p, index) => (
        <Transform
          rotate={Math.PI + Math.atan(deriv(p[0]))}
          key={index}
        >
          <PizzaSlice at={p} radius={0.5} />
        </Transform>
      ))}

      {offset.element}
    </Mafs>
  )
}
