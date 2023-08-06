// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace vec {
  /**
   * @fileinfo
   *
   * Mafs' internal linear algebra functions.
   *
   * A lot of the code here was adapted from [vec-la](https://github.com/francisrstokes/vec-la) 1.4.0,
   * which was released under the MIT license.
   */

  /**
   * A two-dimensional vector
   */
  export type Vector2 = [x: number, y: number]

  /**
   * A 2x3 representation of a 3x3 matrix used to transform and translate a
   * two-dimensional vector.
   */
  export type Matrix = [number, number, number, number, number, number]

  /**
   * Add two vectors
   */
  export function add(v: Vector2, v2: Vector2): Vector2 {
    return [v[0] + v2[0], v[1] + v2[1]]
  }

  /**
   * Subtract one vector from another
   */
  export function sub(v: Vector2, v2: Vector2): Vector2 {
    return [v[0] - v2[0], v[1] - v2[1]]
  }

  /**
   * Get the magnitude of a vector
   */
  export function mag(v: Vector2): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1])
  }

  /**
   * Get the normal vector of a vector
   */
  export function normal(v: Vector2): Vector2 {
    return [-v[1], v[0]]
  }

  /**
   * Linear interpolation between two vectors
   */
  export function lerp(v1: Vector2, v2: Vector2, t: number): Vector2 {
    const d = sub(v2, v1)
    const m = mag(d)
    return add(v1, withMag(d, t * m))
  }

  export function withMag(v: Vector2, m: number): Vector2 {
    const magnitude = mag(v)
    return scale(v, m / magnitude)
  }
  /**
   * Return a normalized version of a vector
   */
  export function normalize(v: Vector2): Vector2 {
    return withMag(v, 1)
  }

  /**
   * Scale a vector by a scalar
   */
  export function scale(v: Vector2, sc: number): Vector2 {
    return [v[0] * sc, v[1] * sc]
  }

  /**
   * Apply a matrix transformation to a vector
   */
  export function transform(v: Vector2, m: Matrix): Vector2 {
    return [v[0] * m[0] + v[1] * m[1] + m[2], v[0] * m[3] + v[1] * m[4] + m[5]]
  }

  /**
   * Multiply two matrices (compose 2D transformations)
   */
  export function matrixMult(m: Matrix, m2: Matrix): Matrix {
    return matrixCreate(
      m[0] * m2[0] + m[1] * m2[3],
      m[3] * m2[0] + m[4] * m2[3],
      m[0] * m2[1] + m[1] * m2[4],
      m[3] * m2[1] + m[4] * m2[4],
      m[0] * m2[2] + m[1] * m2[5] + m[2],
      m[3] * m2[2] + m[4] * m2[5] + m[5],
    )
  }

  /**
   * Rotates a vector around the origin. Shorthand for a rotation matrix
   */
  export function rotate(v: Vector2, a: number): Vector2 {
    const c = Math.cos(a)
    const s = Math.sin(a)
    return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]
  }

  /**
   * Rotates a vector around a given point.
   */
  export function rotateAbout(v: Vector2, cp: Vector2, a: number): Vector2 {
    const v2 = sub(v, cp)
    return add(cp, rotate(v2, a))
  }

  /**
   * Gets the midpoint of two vectors
   */
  export function midpoint(v: Vector2, v2: Vector2): Vector2 {
    return lerp(v, v2, 0.5)
  }

  /**
   * Gets the distance between two vectors
   */
  export function dist(v: Vector2, v2: Vector2): number {
    return Math.sqrt(squareDist(v, v2))
  }

  /**
   * Get the square distance between two vectors
   */
  export function squareDist(v: Vector2, v2: Vector2): number {
    return Math.pow(v2[0] - v[0], 2) + Math.pow(v2[1] - v[1], 2)
  }

  /**
   * Dot product of two vectors
   */
  export function dot(v: Vector2, v2: Vector2): number {
    return v[0] * v2[0] + v[1] * v2[1]
  }

  /**
   * Determinant of a matrix
   */
  export function det(m: Matrix): number {
    return m[0] * m[4] - m[3] * m[1]
  }

  /**
   * Inverts a 3x3 matrix, returning null if the determinant is zero
   * (indicating a degenerate transformation)
   */
  export function matrixInvert(a: Matrix): Matrix | null {
    // Calculate the determinant
    const mDet = det(a)
    if (!mDet) return null

    const invDet = 1.0 / mDet

    const a00 = a[0],
      a01 = a[1],
      a02 = a[2]
    const a10 = a[3],
      a11 = a[4],
      a12 = a[5]

    return matrixCreate(
      invDet * a11,
      invDet * -a10,
      invDet * -a01,
      invDet * a00,
      invDet * (a12 * a01 - a02 * a11),
      invDet * (-a12 * a00 + a02 * a10),
    )
  }

  /**
   * Returns a builder object for easily creating a matrix from several transformations.
   *
   * ```ts
   * const matrix =
   *   vec.matrixBuilder().translate(10, 10).scale(2).get()
   * ```
   *
   * An existing matrix can also be passed in to start with.
   */
  export function matrixBuilder(m: Matrix | null = null) {
    const _m = m || matrixCreate()

    return {
      mult: (m: Matrix) => matrixBuilder(matrixMult(m, _m)),
      translate: (x: number, y: number) =>
        matrixBuilder(matrixMult(matrixCreate(1, 0, 0, 1, x, y), _m)),
      rotate: (a: number) => {
        const c = Math.cos(a)
        const s = Math.sin(a)
        return matrixBuilder(matrixMult(matrixCreate(c, s, -s, c), _m))
      },
      scale: (x: number, y: number) => matrixBuilder(matrixMult(matrixCreate(x, 0, 0, y), _m)),
      shear: (x: number, y: number) => matrixBuilder(matrixMult(matrixCreate(1, y, x, 1), _m)),
      get: (): Matrix => [..._m],
    }
  }

  /**
   * Represent a matrix as a CSS transform `matrix(...)` string
   */
  export function toCSS(matrix: Matrix) {
    const [a, c, tx, b, d, ty] = matrix
    return `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`
  }

  export const identity = matrixBuilder().get()
}

/**
 * Create a matrix
 */
function matrixCreate(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0): vec.Matrix {
  return [a, c, tx, b, d, ty]
}
