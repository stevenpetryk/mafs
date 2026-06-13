import { Ellipse } from "../Ellipse"
import { vec } from "../../vec"

export interface SemiMajorAxisProps extends Filled {
  focus1: vec.Vector2
  focus2: vec.Vector2
  semiMajorAxis: number
  svgEllipseProps?: React.SVGProps<SVGEllipseElement>
}

export function SemiMajorAxis({
  focus1,
  focus2,
  semiMajorAxis
}: SemiMajorAxisProps){
  const center = vec.midpoint(focus1,focus2)
  const angle = Math.atan2(focus1[1]-focus2[1],focus1[0]-focus2[0])
  const focalDistance = vec.dist(focus1, center)
  const semiMinorAxis = Math.sqrt(semiMajorAxis**2 - focalDistance**2)

  return (
    <Ellipse.Center center={center} radius={[semiMajorAxis, semiMinorAxis]} angle={angle}/>
  )
}
