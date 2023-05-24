import * as React from "react"
import katex, { KatexOptions } from "katex"
import { vec } from "../vec"
import { useTransformContext } from "../context/TransformContext"
import { Theme } from "./Theme"

interface LatexProps {
  tex: string
  at: vec.Vector2
  katexOptions?: KatexOptions
}

export function LaTeX({ at: center, tex, katexOptions }: LatexProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const { viewTransform, userTransform } = useTransformContext()
  const combinedTransform = vec.matrixMult(viewTransform, userTransform)

  // TODO: there's gotta be a better way to do this lol
  const width = 10000
  const height = 10000

  React.useEffect(() => {
    if (!ref.current) return
    katex.render(tex, ref.current, katexOptions)
  }, [katexOptions, tex])

  const pixelCenter = vec.add(vec.transform(center, combinedTransform), [-width / 2, -height / 2])

  return (
    <foreignObject
      x={pixelCenter[0]}
      y={pixelCenter[1]}
      width={width}
      height={height}
      pointerEvents="none"
    >
      <div
        style={{
          fontSize: "1.3em",
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          color: Theme.foreground,
        }}
      >
        <span ref={ref} />
      </div>
    </foreignObject>
  )
}
