import { Coordinates, Mafs } from "mafs"

export default function Example() {
    return (
        <Mafs height={300}>
            <Coordinates.Dot subdivisions={4} xAxis={false} yAxis={false} />
        </Mafs>
    )
}
