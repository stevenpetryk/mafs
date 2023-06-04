import * as React from "react"
import katex, { KatexOptions } from "katex"
import { vec } from "../vec"
import { useTransformContext } from "../context/TransformContext"
import { Theme } from "./Theme"

interface LatexProps {
  tex: string
  at: vec.Vector2
  color?: string
  katexOptions?: KatexOptions
}

export function LaTeX({ at: center, tex, color = Theme.foreground, katexOptions }: LatexProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const { viewTransform, userTransform } = useTransformContext()
  const combinedTransform = vec.matrixMult(viewTransform, userTransform)

  // TODO: there's probably a better way to do this but we want to leave plenty
  // of room for the LaTeX to expand
  const width = 99999
  const height = 99999

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
          color,
          textShadow: `, 0 0 2px ${Theme.background}`.repeat(8).slice(2),
        }}
      >
        <span ref={ref} />
      </div>
    </foreignObject>
  )
}
