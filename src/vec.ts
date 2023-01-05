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
 * A 3x3 matrix (generally used for 2D transformations)
 */
export type Matrix = [number, number, number, number, number, number, number, number, number]

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
  return add(v1, scale(normalize(d), t * m))
}

/**
 * Return a normalized version of a vector
 */
export function normalize(v: Vector2): Vector2 {
  const magnitude = mag(v)
  return [v[0] / magnitude, v[1] / magnitude]
}

export function withMag(v: Vector2, m: number): Vector2 {
  return scale(normalize(v), m)
}

/**
 * Scale a vector by a scalar
 */
export function scale(v: Vector2, sc: number): Vector2 {
  return [v[0] * sc, v[1] * sc]
}

/**
 * Create a matrix
 */
function matrixCreate(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0): Matrix {
  return [a, c, tx, b, d, ty, 0, 0, 1]
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
  return [
    m[0] * m2[0] + m[1] * m2[3] + m[2] * m2[6],
    m[0] * m2[1] + m[1] * m2[4] + m[2] * m2[7],
    m[0] * m2[2] + m[1] * m2[5] + m[2] * m2[8],
    m[3] * m2[0] + m[4] * m2[3] + m[5] * m2[6],
    m[3] * m2[1] + m[4] * m2[4] + m[5] * m2[7],
    m[3] * m2[2] + m[4] * m2[5] + m[5] * m2[8],
    m[6] * m2[0] + m[7] * m2[3] + m[8] * m2[6],
    m[6] * m2[1] + m[7] * m2[4] + m[8] * m2[7],
    m[6] * m2[2] + m[7] * m2[5] + m[8] * m2[8],
  ]
}

/**
 * Rotates a vector around the origin. Shorthand for a rotation matrix
 */
export function rotate(v: Vector2, a: number): Vector2 {
  return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)]
}

/**
 * Rotates a vector around a given point.
 */
export function rotateAbout(v: Vector2, cp: Vector2, a: number): Vector2 {
  const v2 = sub(v, cp)
  return add(cp, [
    v2[0] * Math.cos(a) - v2[1] * Math.sin(a),
    v2[0] * Math.sin(a) + v2[1] * Math.cos(a),
  ])
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
  return Math.sqrt(Math.pow(v2[0] - v[0], 2) + Math.pow(v2[1] - v[1], 2))
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
 * Inverts a 3x3 matrix, returning null if the determinant is zero (indicating a degenerate
 * transformation)
 */
export function matrixInvert(matrix: Matrix): Matrix | null {
  const a = matrix
  const out: Matrix = new Array(9) as Matrix

  const a00 = a[0],
    a01 = a[1],
    a02 = a[2]
  const a10 = a[3],
    a11 = a[4],
    a12 = a[5]
  const a20 = a[6],
    a21 = a[7],
    a22 = a[8]

  const b01 = a22 * a11 - a12 * a21
  const b11 = -a22 * a10 + a12 * a20
  const b21 = a21 * a10 - a11 * a20

  // Calculate the determinant
  let det = a00 * b01 + a01 * b11 + a02 * b21

  if (!det) return null
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
    translate: (x: number, y: number) => matrixBuilder(matrixMult([1, 0, x, 0, 1, y, 0, 0, 1], _m)),
    rotate: (a: number) =>
      matrixBuilder(
        matrixMult([Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1], _m)
      ),
    scale: (x: number, y: number) => matrixBuilder(matrixMult([x, 0, 0, 0, y, 0, 0, 0, 1], _m)),
    shear: (x: number, y: number) => matrixBuilder(matrixMult([1, x, 0, y, 1, 0, 0, 0, 1], _m)),
    get: (): Matrix => [..._m],
  }
}

// Gather all exported functions here
export const vec = {
  add,
  sub,
  mag,
  normalize,
  lerp,
  matrixCreate,
  matrixMult,
  rotate,
  rotateAbout,
  midpoint,
  dist,
  dot,
  det,
  matrixInvert,
  matrixBuilder,
}
