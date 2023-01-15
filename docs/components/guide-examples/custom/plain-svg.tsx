import { Mafs, CartesianCoordinates } from "mafs"

function MyCustomCircle() {
  // Render a plain-old SVG <circle />
  return (
    // prettier-ignore
    <circle cx={1} cy={0} r={5} fill="red" stroke="white" />
  )
}

export default function PlainSVGExample() {
  return (
    <Mafs height={300} viewBox={{ y: [-1, 1] }}>
      <CartesianCoordinates />
      <MyCustomCircle />
    </Mafs>
  )
}
