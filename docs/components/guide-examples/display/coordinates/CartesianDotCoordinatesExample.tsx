import { Coordinates, Mafs } from "mafs"

export default function Example() {
  return (
    <Mafs height={300}>
      <Coordinates.Cartesian subdivisions={5} gridStyle="dots" />
    </Mafs>
  )
}
