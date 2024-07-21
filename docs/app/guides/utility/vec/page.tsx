import Code from "components/Code"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Linear algebra (vec)",
}

function Stopwatch() {
  return (
    <>
      <p>
        Mafs ships with <code>vec</code>: a typed, improved, and tested version of the{" "}
        <a href="https://github.com/francisrstokes/vec-la">vec-la</a> linear algebra library. It
        makes it easier to work with vectors and matrices. Mafs uses it internally for a lot of
        graphics heavy lifting.
      </p>

      <Code language="tsx" source={`import { vec } from "mafs"`} />

      <h2>Vector functions</h2>

      <Code
        language="tsx"
        source={`
          // Basics
          vec.add(v: Vector2, v2: Vector2): Vector2;
          vec.sub(v: Vector2, v2: Vector2): Vector2;

          // Rotation
          vec.rotate(v: Vector2, a: number): Vector2;
          vec.rotateAbout(v: Vector2, cp: Vector2, a: number): Vector2;

          // Scaling
          vec.normalize(v: Vector2): Vector2;
          vec.scale(v: Vector2, sc: number): Vector2;
          vec.mag(v: Vector2): number;
          vec.withMag(v: Vector2, m: number): Vector2;

          // Interpolation
          vec.lerp(v1: Vector2, v2: Vector2, t: number): Vector2;
          vec.midpoint(v: Vector2, v2: Vector2): Vector2;

          // Miscellaneous
          vec.dot(v: Vector2, v2: Vector2): number;
          vec.normal(v: Vector2): Vector2;
          vec.dist(v: Vector2, v2: Vector2): number;
          vec.squareDist(v: Vector2, v2: Vector2): number;
        `}
      />

      <h2>Matrix functions</h2>

      <h3>Simple functions</h3>

      <Code
        language="tsx"
        source={`
          // Basics
          vec.transform(v: Vector2, m: Matrix): Vector2;
          vec.matrixMult(m: Matrix, m2: Matrix): Matrix;

          // Matrix inversion
          vec.det(m: Matrix): number;
          vec.matrixInvert(a: Matrix): Matrix | null; // Returns null if the matrix is singular

          // For generating matrix() CSS functions
          // Note: CSS matrices have a different ordering than vec's matrices.
          vec.toCSS(matrix: Matrix): string;
        `}
      />

      <h3>Matrix builder</h3>

      <p>
        Since matrices represent 2D graphics operations, it's useful to have a way to construct a
        matrix in terms of common operations like translation, scaling, etc. To serve that need,
        Mafs, like vec-la, exposes a <code>matrixBuilder</code> helper:
      </p>

      <Code
        language="tsx"
        source={`
          const rotateAndScale = vec
            .matrixBuilder()
            .rotate(Math.PI / 4)
            .scale(2, 2)
            .get() // Remember to call .get()

          vec.matrixBuilder(startingMatrix?: Matrix) => MatrixBuilder
          interface MatrixBuilder {
            mult: (m: Matrix) => MatrixBuilder
            translate: (x: number, y: number) => MatrixBuilder
            rotate: (a: number) => MatrixBuilder
            scale: (x: number, y: number) => MatrixBuilder
            shear: (x: number, y: number) => MatrixBuilder
            get: () => Matrix
          }
        `}
      />

      <p>
        The first argument to <code>matrixBuilder</code> is an optional starting matrix.
      </p>
    </>
  )
}

export default Stopwatch
