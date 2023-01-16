import { Mafs, CartesianCoordinates, Debug } from "mafs"

export default function Example() {
  return (
    <Mafs viewBox={{ x: [-1, 1], y: [-1, 1] }}>
      <CartesianCoordinates />
      <Debug.ViewportInfo />
    </Mafs>
  )
}
