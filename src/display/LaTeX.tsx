import * as React from "react"
import { createPortal } from "react-dom"
import katex, { KatexOptions } from "katex"
import { useCoordinateContext } from "../context/CoordinateContext"
import { useMafsContext } from "../context/MafsContext"
import { vec } from "../vec"
import { useTransformContext } from "../context/TransformContext"
import { Theme } from "./Theme"

export interface LatexProps {
  tex: string
  at: vec.Vector2
  color?: string
  katexOptions?: KatexOptions
}

type ScreenPoint = { x: number; y: number }
type CoordinateBounds = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  width: number
  height: number
}

function toScreenPoint(
  svg: SVGSVGElement,
  pixelPoint: vec.Vector2,
  coordinates: CoordinateBounds,
): ScreenPoint | null {
  if (typeof svg.getScreenCTM === "function") {
    const screenTransform = svg.getScreenCTM()
    if (screenTransform) {
      const point = svg.createSVGPoint()
      point.x = pixelPoint[0]
      point.y = pixelPoint[1]
      const screenPoint = point.matrixTransform(screenTransform)
      return { x: screenPoint.x, y: screenPoint.y }
    }
  }

  // Test DOMs and a few embedded SVG implementations do not expose
  // getScreenCTM. Keep a geometry fallback for Mafs' xMidYMin viewBox.
  const rect = svg.getBoundingClientRect()
  const viewBox = svg.viewBox?.baseVal
  const viewBoxX =
    viewBox?.x ?? (coordinates.xMin / (coordinates.xMax - coordinates.xMin)) * coordinates.width
  const viewBoxY =
    viewBox?.y ?? (coordinates.yMax / (coordinates.yMin - coordinates.yMax)) * coordinates.height
  const viewBoxWidth = viewBox?.width ?? coordinates.width
  const viewBoxHeight = viewBox?.height ?? coordinates.height
  if (viewBoxWidth === 0 || viewBoxHeight === 0) return null

  const scale = Math.min(rect.width / viewBoxWidth, rect.height / viewBoxHeight)
  const offsetX = (rect.width - viewBoxWidth * scale) / 2
  return {
    x: rect.left + offsetX + (pixelPoint[0] - viewBoxX) * scale,
    y: rect.top + (pixelPoint[1] - viewBoxY) * scale,
  }
}

export function LaTeX({ at: center, tex, color = Theme.foreground, katexOptions }: LatexProps) {
  // Reading this context subscribes LaTeX to camera panning. A pan changes the
  // SVG viewBox without changing the pixel scale, so TransformContext alone
  // does not necessarily receive a new object.
  const coordinateContext = useCoordinateContext()
  const { svgRef, latexLayer } = useMafsContext()
  const { viewTransform, userTransform } = useTransformContext()
  const combinedTransform = vec.matrixMult(viewTransform, userTransform)
  const pixelCenter = vec.transform(center, combinedTransform)
  const pixelX = pixelCenter[0]
  const pixelY = pixelCenter[1]

  const html = React.useMemo(() => katex.renderToString(tex, katexOptions), [katexOptions, tex])
  const [position, setPosition] = React.useState<vec.Vector2 | null>(null)

  const updatePosition = React.useCallback(() => {
    const svg = svgRef.current
    if (!svg || !latexLayer) {
      setPosition(null)
      return
    }

    const screenPoint = toScreenPoint(svg, [pixelX, pixelY], coordinateContext)
    if (!screenPoint) return

    const layerRect = latexLayer.getBoundingClientRect()
    // `left` and `top` are layout pixels inside the HTML overlay, while
    // getScreenCTM() returns screen pixels. CSS zoom and browser zoom can make
    // those spaces differ, so convert through the overlay's actual scale.
    const layerScaleX = latexLayer.offsetWidth > 0 ? layerRect.width / latexLayer.offsetWidth : 1
    const layerScaleY = latexLayer.offsetHeight > 0 ? layerRect.height / latexLayer.offsetHeight : 1
    const nextPosition: vec.Vector2 = [
      (screenPoint.x - layerRect.left) / layerScaleX,
      (screenPoint.y - layerRect.top) / layerScaleY,
    ]

    setPosition((previous) => {
      if (
        previous &&
        Math.abs(previous[0] - nextPosition[0]) < 0.01 &&
        Math.abs(previous[1] - nextPosition[1]) < 0.01
      ) {
        return previous
      }
      return nextPosition
    })
  }, [coordinateContext, latexLayer, pixelX, pixelY, svgRef])

  React.useLayoutEffect(() => {
    if (!latexLayer || !svgRef.current) return

    updatePosition()
    const frame = window.requestAnimationFrame(updatePosition)
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updatePosition)
    resizeObserver?.observe(latexLayer)
    resizeObserver?.observe(svgRef.current)

    window.addEventListener("resize", updatePosition, { passive: true })
    window.visualViewport?.addEventListener("resize", updatePosition, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      window.removeEventListener("resize", updatePosition)
      window.visualViewport?.removeEventListener("resize", updatePosition)
    }
  }, [latexLayer, svgRef, updatePosition])

  if (!latexLayer || !position) return null

  return createPortal(
    <div
      className="mafs-latex-label"
      style={{
        position: "absolute",
        left: position[0],
        top: position[1],
        width: "max-content",
        maxWidth: "none",
        color,
        fontSize: "1.3em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
        textShadow: "0 0 2px var(--mafs-bg)",
        transform: "translate(-50%, -50%)",
        transformOrigin: "center center",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />,
    latexLayer,
  )
}
