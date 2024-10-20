import { Anchor, computeAnchor } from "../math"

export interface ImageProps {
  src: string
  x: number
  y: number
  width: number
  height: number
  anchor?: Anchor
  preserveAspectRatio?: string
  svgImageProps?: React.SVGProps<SVGImageElement>
}

export function Image({
  src,
  x,
  y,
  width,
  height,
  anchor = "bl",
  preserveAspectRatio,
  svgImageProps,
}: ImageProps) {
  const [anchorX, anchorY] = computeAnchor(anchor, x, y, width, height)

  const transform = [
    "var(--mafs-view-transform)",
    "var(--mafs-user-transform)",
    // Ensure the image is not upside down (since Mafs has the y-axis pointing,
    // while SVG has it pointing down)
    "scaleY(-1)",
  ].join(" ")

  const debug = false

  return (
    <>
      {debug && (
        <rect
          x={anchorX}
          y={-anchorY}
          width={width}
          height={height}
          fill="none"
          stroke="red"
          vectorEffect={"non-scaling-stroke"}
          style={{ transform }}
        />
      )}
      <image
        href={src}
        x={anchorX}
        y={-anchorY}
        width={width}
        height={height}
        preserveAspectRatio={preserveAspectRatio}
        {...svgImageProps}
        style={{ transform }}
      />
    </>
  )
}
