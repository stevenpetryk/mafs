import { Mafs, Coordinates } from "mafs"

export default function Example() {
  return (
    <Mafs height={300}>
      <Coordinates.Polar subdivisions={2} />
    </Mafs>
  )
}