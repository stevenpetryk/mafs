export type Vector2 = [x: number, y: number]
/** An array representing a 3×3 matrix. */
export type Matrix = [number, number, number, number, number, number, number, number, number]

/**
 * A series of 2D linear algebra helpers.
 *
 * @note Some code taken from [@francisrstokes/vec-la](https://github.com/francisrstokes/vec-la).
 */
const vec = {
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
    const mag = vec.mag(v)

    if (mag === 0) return [0, 0]
    return [v[0] / mag, v[1] / mag]
  },

  /** Scales `v` by a scalar quantity */
  scale(v: Vector2, scalar: number): Vector2 {
    return [v[0] * scalar, v[1] * scalar]
  },

  /** Computes the linear interpolation between `a` and `b` */
  lerp(a: Vector2, b: Vector2, t: number): Vector2 {
    return vec.add(a, vec.scale(vec.sub(b, a), t))
  },

  /** Transforms the vector `v` by the matrix `m` */
  trans(v: Vector2, m: Matrix): Vector2 {
    return [
      // prettier-ignore
      m[0] * v[0] + m[1] * v[1] + m[2],
      m[3] * v[0] + m[4] * v[1] + m[5],
    ]
  },

  /** Computes the midpoint of `v1` and `v2` */
  midpoint(v1: Vector2, v2: Vector2): Vector2 {
    return vec.scale(vec.add(v1, v2), 0.5)
  },

  /** Computes the dot product of `v1` and `v2` */
  dot(v1: Vector2, v2: Vector2): number {
    return v1[0] * v2[0] + v1[1] * v2[1]
  },

  /** Computes the determinant of 3x3 matrix `m` */
  det(m: Matrix): number {
    return m[0] * m[4] - m[1] * m[3] + m[2] * (m[1] * m[5] - m[2] * m[4])
  },

  /** Compute the distance between `v1` and `v2` */
  dist(v1: Vector2, v2: Vector2): number {
    return vec.mag(vec.sub(v1, v2))
  },

  /** Inverts `m`, returning `null` if the matrix cannot be inverted */
  invert(m: Matrix): Matrix | null {
    const out: Matrix = new Array(9) as Matrix

    const a00 = m[0],
      a01 = m[1],
      a02 = m[2]
    const a10 = m[3],
      a11 = m[4],
      a12 = m[5]
    const a20 = m[6],
      a21 = m[7],
      a22 = m[8]

    const b01 = a22 * a11 - a12 * a21
    const b11 = -a22 * a10 + a12 * a20
    const b21 = a21 * a10 - a11 * a20

    // Calculate the determinant
    let det = vec.det(m)

    if (Math.abs(det) <= 1e-12) return null
    det = 1.0 / det

    out[0] = b01 * det
    out[1] = (-a22 * a01 + a02 * a21) * det
    out[2] = (a12 * a01 - a02 * a11) * det
    out[3] = b11 * det
    out[4] = (a22 * a00 - a02 * a20) * det
    out[5] = (-a12 * a00 + a02 * a10) * det
    out[6] = b21 * det
    out[7] = (-a21 * a00 + a01 * a20) * det
    out[8] = (a11 * a00 - a01 * a10) * det

    return out
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

export default vec
