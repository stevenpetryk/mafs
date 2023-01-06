"use client"

import {
  Mafs,
  LaTeX,
  CartesianCoordinates,
  useMovablePoint,
  Transform,
} from "mafs"

const x = "\\x"

import { round } from "mafs/math"

export default function LatexExample() {
  const l = useMovablePoint([-2, 1], {
    constrain: ([x, y]) => [round(x, 1), round(y, 1)],
  })
  const r = useMovablePoint([2, 1], {
    constrain: ([x, y]) => [round(x, 1), round(y, 1)],
  })

  return (
    <Mafs>
      <CartesianCoordinates
        xAxis={{ labels: false }}
        yAxis={{ labels: false }}
      />
      <Transform translate={[-0.7, 0]}>
        <LaTeX
          at={l.point}
          tex={String.raw`
            \begin{bmatrix} ${l.x.toFixed(
              1
            )} \\ ${l.y.toFixed(1)} \end{bmatrix}
          `}
        />
      </Transform>

      <Transform translate={[0.7, 0]}>
        <LaTeX
          at={r.point}
          tex={String.raw`
            \begin{bmatrix} ${r.x.toFixed(
              1
            )} \\ ${r.y.toFixed(1)} \end{bmatrix}
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
        macros={{
          "\\f": "#1f(#2)",
        }}
      />
    </Mafs>
  )
}
