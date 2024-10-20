"use client"

import * as React from "react"
import { Mafs, Coordinates, Plot } from "mafs"

export default function Example() {
  const [debug, setDebug] = React.useState(true)

  return (
    <div>
      {/* Set the `debug` prop on Mafs to get a bird's eye view. */}
      <Mafs debug={debug} height={400}>
        <Coordinates.Cartesian />
        <Plot.OfX y={(x) => Math.sin(x * Math.PI)} />
      </Mafs>
      <label className="p-4 bg-black flex gap-2 pointer">
        <input
          type="checkbox"
          checked={debug}
          onChange={(e) => setDebug(e.target.checked)}
        />
        Debug
      </label>
    </div>
  )
}
