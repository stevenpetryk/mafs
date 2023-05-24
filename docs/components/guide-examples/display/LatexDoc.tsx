"use client"

import { LaTeX, Mafs } from "mafs"

export default function LatexDoc() {
  return (
    <Mafs>
      <LaTeX
        at={[0, 0]}
        tex={String.raw`
          f(x)=f(a)+f'(a)(x-a)+\cdots+\frac{f^{(n)}(a)}{n!}(x-a)^n+R_n(x)
          \\
          R_n(x)=\frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}
        `}
      />
    </Mafs>
  )
}
