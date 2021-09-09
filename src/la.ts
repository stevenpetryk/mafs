export type Vector2 = [x: number, y: number]
/** An array representing a 3×3 matrix. */
export type Matrix = [number, number, number, number, number, number, number, number, number]

/**
 * A series of 2D linear algebra helpers ("la" is short for linear algebra).
 *
 * Adapted from [@francisrstokes/vec-la](https://github.com/francisrstokes/vec-la)
 */
const la = {
  /** Adds two vectors */
  add(a: Vector2, b: Vector2): Vector2 {
    return [a[0] + b[0], a[1] + b[1]]
  },

  /** Subtracts two vectors (a - b) */
  sub(a: Vector2, b: Vector2): Vector2 {
    return [a[0] - b[0], a[1] - b[1]]
  },

  /** Computes the scalar magnitude of `v` */
  mag(v: Vector2): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1])
  },

  /**
   * Computes the squared magnitude of `v`.
   *
   * This is useful for comparing magnitudes of vectors, since it is faster than
   * computing the true magnitude.
   */
  magSq(v: Vector2): number {
    return v[0] * v[0] + v[1] * v[1]
  },

  /**
   * Normalizes `v` to a unit vector.
   *
   * If `v` is the zero vector, returns the zero vector.
   */
  norm(v: Vector2): Vector2 {
    const mag = la.mag(v)

    if (mag === 0) return [0, 0]
    return [v[0] / mag, v[1] / mag]
  },

  scale(v: Vector2, scalar: number): Vector2 {
    return [v[0] * scalar, v[1] * scalar]
  },

  /** Computes the linear interpolation between `a` and `b` */
  lerp(a: Vector2, b: Vector2, t: number): Vector2 {
    return la.add(a, la.scale(la.sub(b, a), t))
  },

  /** Transforms the vector `v` by the matrix `m` */
  trans(v: Vector2, m: Matrix): Vector2 {
    return [
      // prettier-ignore
      m[0] * v[0] + m[1] * v[1] + m[2],
      m[3] * v[0] + m[4] * v[1] + m[5],
    ]
  },

  matrixMult(m1: Matrix, m2: Matrix): Matrix {
    return [
      m1[0] * m2[0] + m1[1] * m2[3] + m1[2] * m2[6],
      m1[0] * m2[1] + m1[1] * m2[4] + m1[2] * m2[7],
      m1[0] * m2[2] + m1[1] * m2[5] + m1[2] * m2[8],
      m1[3] * m2[0] + m1[4] * m2[3] + m1[5] * m2[6],
      m1[3] * m2[1] + m1[4] * m2[4] + m1[5] * m2[7],
      m1[3] * m2[2] + m1[4] * m2[5] + m1[5] * m2[8],
      m1[6] * m2[0] + m1[7] * m2[3] + m1[8] * m2[6],
      m1[6] * m2[1] + m1[7] * m2[4] + m1[8] * m2[7],
      m1[6] * m2[2] + m1[7] * m2[5] + m1[8] * m2[8],
    ]
  },
}

export default la
