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
  const [actualX, actualY] = computeAnchor(anchor, x, y, width, height)

  const scaleX = width < 0 ? -1 : 1
  const scaleY = height < 0 ? -1 : 1

  console.log(actualX - (width < 0 ? -width : 0))

  return (
    <image
      href={src}
      x={actualX - (width < 0 ? -width : 0)}
      y={actualY - (height < 0 ? -height : 0)}
      width={Math.abs(width)}
      height={Math.abs(height)}
      preserveAspectRatio={preserveAspectRatio}
      {...svgImageProps}
      style={{
        transform: [`var(--mafs-view-transform)`, `var(--mafs-user-transform)`, `scaleY(-1) `].join(
          " ",
        ),
      }}
    />
  )
}
