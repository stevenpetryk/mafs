"use client"

import { Mafs, LaTeX, CartesianCoordinates, useMovablePoint, Transform } from "mafs"
import { round } from "mafs/math"

export default function LatexPage() {
  const l = useMovablePoint([-2, 1], { constrain: ([x, y]) => [round(x, 1), round(y, 1)] })
  const r = useMovablePoint([2, 1], { constrain: ([x, y]) => [round(x, 1), round(y, 1)] })

  return (
    <>
      <Mafs>
        <CartesianCoordinates />
        <Transform translate={[-0.7, 0]}>
          <LaTeX
            at={l.point}
            tex={String.raw`
            \begin{bmatrix} ${l.x.toFixed(1)} \\ ${l.y.toFixed(1)} \end{bmatrix}
          `}
          />
        </Transform>

        <Transform translate={[0.7, 0]}>
          <LaTeX
            at={r.point}
            tex={String.raw`
            \begin{bmatrix} ${r.x.toFixed(1)} \\ ${r.y.toFixed(1)} \end{bmatrix}
          `}
          />
        </Transform>

        {l.element}
        {r.element}
      </Mafs>
    </>
  )
}
