import React from "react"
import { Vector2 } from ".."

type Bee = "asdf" | "bee"

interface EllipseProps {
  foo: Bee
  bar: number
}

const Ellipse: React.VFC<EllipseProps> = ({ foo, bar }) => {
  return (
    <h1>
      {foo.toString()} {bar}
    </h1>
  )
}

export default Ellipse
