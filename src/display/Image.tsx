import { Anchor, computeAnchor } from "../math"

export interface ImageProps {
  href: string
  x: number
  y: number
  /**
   * Indicate where, in the image (top, bottom, left, right, center), the x and
   * y coordinate refers to.
   */
  anchor?: Anchor
  width: number
  height: number
  /**
   * Whether to preserve the aspect ratio of the image. By default, the image
   * will be centered and scaled to fit the width and height. If you want to
   * squish the image to be the same shape as the box, set this to "none".
   *
   * This is passed directly to the `preserveAspectRatio` attribute of the SVG
   * `<image>` element.
   *
   * See [preserveAspectRatio](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio) on MDN.
   */
  preserveAspectRatio?: string

  svgImageProps?: React.SVGProps<SVGImageElement>
}

export function Image({
  href,
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
    // Ensure the image is not upside down (since Mafs has the y-axis pointing
    // up, while SVG has it pointing down).
    "scaleY(-1)",
  ].join(" ")

  return (
    <image
      href={href}
      x={anchorX}
      y={-anchorY}
      width={width}
      height={height}
      preserveAspectRatio={preserveAspectRatio}
      {...svgImageProps}
      style={{ transform }}
    />
  )
}
