import { Ellipse } from "../Ellipse"
import { vec } from "../../vec"

export interface SemiMinorAxisProps extends Filled {
  focus1: vec.Vector2
  focus2: vec.Vector2
  semiMinorAxis: number
  svgEllipseProps?: React.SVGProps<SVGEllipseElement>
}

export function SemiMinorAxis({
  focus1,
  focus2,
  semiMinorAxis
}: SemiMinorAxisProps){
  const center = vec.midpoint(focus1,focus2)
  const angle = Math.atan2(focus1[1]-focus2[1],focus1[0]-focus2[0])
  const focalDistance = vec.dist(focus1, center)
  const semiMajorAxis = Math.sqrt(semiMinorAxis**2 + focalDistance**2)

  return (
    <Ellipse.Center center={center} radius={[semiMajorAxis, semiMinorAxis]} angle={angle}/>
  )
}
