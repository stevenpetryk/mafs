import { Mafs, CartesianCoordinates, Debug } from "mafs"

export default function Example() {
  return (
    <Mafs height={300} viewBox={{ y: [-1, 1], x: [-1, 1] }}>
      <CartesianCoordinates />

      <Debug.TransformWidget>
        <PartyCircle />
      </Debug.TransformWidget>
    </Mafs>
  )
}

function PartyCircle() {
  return (
    <circle
      style={{
        // This is all it takes to Mafs-ify this circle!
        transform:
          "var(--mafs-view-transform) var(--mafs-user-transform)",
        // This makes it so that transforms don't
        // affect the stroke width. Mafs uses this
        // almost everywhere internally.
        vectorEffect: "non-scaling-stroke",
      }}
      fill="#f003"
      stroke="tomato"
      cx={0}
      cy={0}
      r={0.5}
      strokeDasharray="31.4 31.4"
      strokeWidth={3}
      strokeLinecap="round"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="0; 62.8"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  )
}
