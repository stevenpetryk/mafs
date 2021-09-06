import React from "react"
import { Filled, theme } from "./Theme"
import { useScaleContext } from "view/ScaleContext"

export interface EllipseProps extends Filled {
  center: Vector2
  radius: Vector2
  angle?: number
  svgEllipseProps?: React.SVGProps<SVGEllipseElement>
}

const Ellipse: React.VFC<EllipseProps> = ({
  center,
  radius,
  angle = 0,
  strokeStyle = "solid",
  strokeOpacity = 1.0,
  weight = 2,
  color = theme.foreground,
  fillOpacity = 0.15,
  svgEllipseProps = {},
}) => {
  const { cssScale } = useScaleContext()

  const rotate = `rotate(${(angle * 180) / Math.PI} ${center[0]} ${center[1]})`

  return (
    <ellipse
      cx={center[0]}
      cy={center[1]}
      rx={radius[0]}
      ry={radius[1]}
      strokeWidth={weight}
      strokeDasharray={strokeStyle === "dashed" ? "4,3" : undefined}
      transform={`${cssScale} ${rotate}`}
      {...svgEllipseProps}
      style={{
        stroke: color,
        fill: color,
        fillOpacity,
        strokeOpacity,
        vectorEffect: "non-scaling-stroke",
        ...(svgEllipseProps.style || {}),
      }}
    />
  )
}

export default Ellipse
