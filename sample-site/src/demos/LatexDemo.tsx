import { Mafs, Coordinates, LaTeX } from "mafs"

export function LatexDemo() {
  return (
    <Mafs viewBox={{ x: [-5, 5], y: [-3, 3] }}>
      <Coordinates.Cartesian subdivisions={2} />
      <LaTeX
        tex={String.raw`\int_a^b f(x)\,dx = F(b) - F(a)`}
        at={[0, 1.4]}
        color="var(--mafs-green)"
      />
      <LaTeX
        tex={String.raw`\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e`}
        at={[0, -0.4]}
        color="var(--mafs-blue)"
      />
      <LaTeX
        tex={String.raw`\frac{d}{dx} x^n = n x^{n-1}`}
        at={[0, -2.2]}
        color="var(--mafs-pink)"
      />
    </Mafs>
  )
}
