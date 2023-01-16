import { Mafs, CartesianCoordinates } from "mafs"

function MyCustomCircle() {
  return (
    // prettier-ignore
    <circle
      cx={1} cy={0} r={3} fill="#f00a" stroke="white"
      vectorEffect="non-scaling-stroke"
      style={{ transform: "var(--mafs-view-transform)" }}
    />
  )
}

export default function Example() {
  return (
    <Mafs height={300} viewBox={{ y: [-3, 3] }}>
      <CartesianCoordinates />
      <MyCustomCircle />
    </Mafs>
  )
}
