"use client"

import { range } from "lodash"
import {
  Mafs,
  Coordinates,
  Plot,
  Theme,
  useMovablePoint,
} from "mafs"

export default function FunctionsOfXAndY() {
  const { x, y, element } = useMovablePoint([-0.5, 1])

  return (
    <Mafs height={500}>
      <Coordinates.Cartesian />
      {/* <Plot.OfX
        y={(x) => ((2 * x + 2) * (x + 0.5)) / (x + 0.5)}
        keyPoints={() => [
          { type: "hole", at: [x - 1, y + 1] },
        ]}
        color={Theme.blue}
      /> */}
      <Plot.OfX
        y={(x) => Math.tan(x * Math.PI)}
        keyPoints={() =>
          range(-10.5, 10.5, 1).map((x) => ({
            type: "jump",
            at: x,
          }))
        }
        color={Theme.pink}
      />
      {element}
    </Mafs>
  )
}
