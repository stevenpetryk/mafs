"use client"

import { Mafs, Coordinates, Debug } from "mafs"
import * as React from "react"
export default function Example() {
  return (
    <Mafs height={300} viewBox={{ y: [-1, 1], x: [-1, 1] }}>
      <Coordinates.Cartesian />

      <Debug.TransformWidget>
        <PizzaSlice />
      </Debug.TransformWidget>
    </Mafs>
  )
}

function PizzaSlice() {
  const maskId = `pizza-slice-mask-${React.useId()}`

  return (
    <g
      style={{
        transform: `var(--mafs-view-transform) var(--mafs-user-transform)`,
      }}
    >
      <defs>
        <mask id={maskId}>
          {/* prettier-ignore */}
          <polyline points={`0,0 ${1},${1 / 2} ${1},${-1 / 2}`} fill="white" />
        </mask>
      </defs>

      {/* prettier-ignore */}
      <g mask={`url(#${maskId})`}>
        <circle cx={0} cy={0} r={1} fill="brown" />
        <circle cx={0} cy={0} r={1 * 0.85} fill="yellow" />
        <circle cx={0.4} cy={1 * 0.1} r={0.11} fill="red" />
        <circle cx={0.2} cy={-1 * 0.1} r={0.09} fill="red" />
        <circle cx={0.5} cy={-1 * 0.15} r={0.1} fill="red" />
        <circle cx={0.7} cy={1 * 0.05} r={0.11} fill="red" />
        <circle cx={0.65} cy={1 * 0.35} r={0.1} fill="red" />
        <circle cx={0.65} cy={-1 * 0.37} r={0.08} fill="red" />
      </g>
    </g>
  )
}
