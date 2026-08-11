import { Coordinates, Mafs, Text, Transform, useTransformContext, vec } from "mafs"

function ContextCrosshair({ point }: { point: vec.Vector2 }) {
  const { viewTransform, userTransform } = useTransformContext()
  const pixelPoint = vec.transform(point, vec.matrixMult(viewTransform, userTransform))
  const [x, y] = pixelPoint

  return (
    <g stroke="var(--mafs-yellow)" strokeWidth={2} opacity={0.8}>
      <line x1={x - 12} y1={y} x2={x + 12} y2={y} />
      <line x1={x} y1={y - 12} x2={x} y2={y + 12} />
    </g>
  )
}

export function ContextDemo() {
  return (
    <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }}>
      <Coordinates.Cartesian subdivisions={2} />
      <Transform rotate={Math.PI / 7} translate={[0.8, 0.2]}>
        <ContextCrosshair point={[0, 0]} />
        <Text x={0.2} y={0.35} size={17} color="var(--mafs-yellow)">
          custom context
        </Text>
      </Transform>
    </Mafs>
  )
}
