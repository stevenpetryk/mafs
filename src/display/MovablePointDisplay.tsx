import * as React from "react"
import { vec } from "../vec"
import { useTransformContext } from "../context/TransformContext"
import { Theme } from "./Theme"

export interface MovablePointDisplayProps {
  color?: string
  ringRadiusPx?: number
  dragging: boolean
  point: vec.Vector2
  /** Called when the point is clicked without dragging it. */
  onClick?: React.MouseEventHandler<SVGGElement>
  /** Additional attributes for the outer SVG group. */
  svgGroupProps?: React.SVGProps<SVGGElement>
}

export const MovablePointDisplay = React.forwardRef<SVGGElement, MovablePointDisplayProps>(
  (props: MovablePointDisplayProps, ref) => {
    const { color = Theme.pink, ringRadiusPx = 15, dragging, point } = props

    const { viewTransform, userTransform } = useTransformContext()
    const { onClick, svgGroupProps = {} } = props

    const combinedTransform = React.useMemo(
      () => vec.matrixMult(viewTransform, userTransform),
      [viewTransform, userTransform],
    )

    const [xPx, yPx] = vec.transform(point, combinedTransform)

    return (
      <g
        ref={ref}
        {...svgGroupProps}
        style={
          {
            "--movable-point-color": color,
            "--movable-point-ring-size": `${ringRadiusPx}px`,
            ...svgGroupProps.style,
          } as React.CSSProperties
        }
        className={[
          "mafs-movable-point",
          dragging ? "mafs-movable-point-dragging" : "",
          svgGroupProps.className,
        ]
          .filter(Boolean)
          .join(" ")}
        tabIndex={0}
        onClick={onClick ?? svgGroupProps.onClick}
      >
        <circle className="mafs-movable-point-hitbox" r={30} cx={xPx} cy={yPx}></circle>
        <circle
          className="mafs-movable-point-focus"
          r={ringRadiusPx + 1}
          cx={xPx}
          cy={yPx}
        ></circle>
        <circle className="mafs-movable-point-ring" r={ringRadiusPx} cx={xPx} cy={yPx}></circle>
        <circle className="mafs-movable-point-point" r={6} cx={xPx} cy={yPx}></circle>
      </g>
    )
  },
)

MovablePointDisplay.displayName = "MovablePointDisplay"
