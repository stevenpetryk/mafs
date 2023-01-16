// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Mafs, CartesianCoordinates } from "mafs"

function PizzaSlice({ at, radius: r }) {
  const [x, y] = at
  return (
    <g style={{ transform: "var(--mafs-view-transform)" }}>
      <defs>
        <mask id="pizza-slice-mask">
          <polyline
            id="pizza-slice"
            points={`0,0 ${r},${r / 2} ${r},${-r / 2}`}
            fill="white"
            stroke="none"
          />
        </mask>
      </defs>

      <g mask="url(#pizza-slice-mask)">
        <circle cx={x} cy={y} r={r} fill="brown" />
        <circle cx={x} cy={y} r={r * 0.85} fill="yellow" />
        {/* prettier-ignore */}
        <circle cx={x + r * 0.4} cy={y + r*0.1} r={r * 0.11} fill="red" />
        {/* prettier-ignore */}
        <circle cx={x + r * 0.2} cy={y - r*0.1} r={r * 0.09} fill="red" />
        {/* prettier-ignore */}
        <circle cx={x + r * 0.5} cy={y - r*0.15} r={r * 0.1} fill="red" />
        {/* prettier-ignore */}
        <circle cx={x + r * 0.70} cy={y + r*0.05} r={r * 0.11} fill="red" />
        {/* prettier-ignore */}
        <circle cx={x + r * 0.65} cy={y + r*0.35} r={r * 0.1} fill="red" />
        {/* prettier-ignore */}
        <circle cx={x + r * 0.65} cy={y - r*0.37} r={r * 0.08} fill="red" />
      </g>
    </g>
  )
}

export default function Example() {
  return (
    <Mafs height={300} viewBox={{ y: [-1, 1] }}>
      <CartesianCoordinates />
      <PizzaSlice at={[0, 0]} radius={1} />
    </Mafs>
  )
}
