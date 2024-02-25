import * as React from "react"
export default function fancyFx(title: string): React.ReactNode {
  function FOfX() {
    return (
      <>
        <span aria-hidden="true" className="font-display font-normal">
          ƒ(𝑥)
        </span>
        <span className="sr-only">f of x</span>
      </>
    )
  }

  const splitByFx = title.split("f(x)")

  return (
    <span>
      {splitByFx
        .slice(0, -1)
        .map((piece, index) => [
          piece,
          <React.Fragment key={index}>
            {" "}
            <FOfX />
          </React.Fragment>,
        ])
        .concat([splitByFx[splitByFx.length - 1]])
        .flat()}
    </span>
  )
}
