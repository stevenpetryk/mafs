import { Mafs, Coordinates } from "mafs"

export default function Example() {
  return (
    <Mafs height={300} zoom={true}>
      <Coordinates.Cartesian subdivisions={10} />
    </Mafs>
  )
}
