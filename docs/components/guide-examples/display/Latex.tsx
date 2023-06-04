"use client"

import {
  Mafs,
  LaTeX,
  Coordinates,
  useMovablePoint,
  Transform,
} from "mafs"

// \x is still a special case, even when using String.raw,
// so we make a convenient pre-escaped string for it here.
const x = "\\x"

import { round } from "lodash"

export default function LatexExample() {
  const l = useMovablePoint([-2, 1], {
    constrain: ([x, y]) => [round(x, 1), round(y, 1)],
  })
  const r = useMovablePoint([2, 1], {
    constrain: ([x, y]) => [round(x, 1), round(y, 1)],
  })

  const lx = l.x.toFixed(1)
  const ly = l.y.toFixed(1)
  const rx = r.x.toFixed(1)
  const ry = r.y.toFixed(1)

  return (
    <Mafs>
      <Coordinates.Cartesian
        xAxis={{ labels: false }}
        yAxis={{ labels: false }}
      />
      <Transform translate={[-0.7, 0]}>
        <LaTeX
          at={l.point}
          tex={String.raw`
            \begin{bmatrix} ${lx} \\ ${ly} \end{bmatrix}
          `}
        />
      </Transform>

      <Transform translate={[0.7, 0]}>
        <LaTeX
          at={r.point}
          tex={String.raw`
            \begin{bmatrix} ${rx} \\ ${ry} \end{bmatrix}
          `}
        />
      </Transform>

      {l.element}
      {r.element}

      <LaTeX
        at={[-2.5, -2]}
        tex={String.raw`
          % \f is defined as #1f(#2) using the macro
          \f\relax{x} = \int_{-\infty}^\infty
            \f\hat${x}i\,e^{2 \pi i ${x}i x}
            \,d${x}i
        `}
        katexOptions={{ macros: { "\\f": "#1f(#2)" } }}
      />
    </Mafs>
  )
}
