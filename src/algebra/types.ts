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
export type Matrix2x3 = [number, number, number, number, number, number]


/**
 * A 2x3 matrix builder
 *
 */
export interface Matrix2x3Builder {
  mult(m: Matrix2x3): Matrix2x3Builder
  translate(x: number, y: number): Matrix2x3Builder
  rotate(a: number): Matrix2x3Builder
  scale(x: number, y: number): Matrix2x3Builder
  shear(x: number, y: number): Matrix2x3Builder
  get(): Matrix2x3
}

export interface Algebra {
  /**
   * Add two vectors
   */
  add(v: Vector2, v2: Vector2): Vector2

  /**
   * Subtract one vector from another
   */
  sub(v: Vector2, v2: Vector2): Vector2

  /**
   * Get the magnitude of a vector
   */
  mag(v: Vector2): number

  /**
   * Get the normal vector of a vector
   */
  normal(v: Vector2): Vector2

  /**
   * Linear interpolation between two vectors
   */
  lerp(v: Vector2, v2: Vector2, m: number): Vector2

  withMag(v: Vector2, m: number): Vector2

  /**
   * Return a normalized version of a vector
   */
  normalize(v: Vector2): Vector2

  /**
   * Scale a vector by a scalar
   */
  scale(v: Vector2, sc: number): Vector2

  /**
   * Apply a matrix transformation to a vector
   */
  transform(v: Vector2, m: Matrix2x3): Vector2

  /**
   * Multiply two matrices (compose 2D transformations)
   */
  matrixMult(m1: Matrix2x3, m2: Matrix2x3): Matrix2x3

  /**
   * Rotates a vector around the origin. Shorthand for a rotation matrix
   */
  rotate(v: Vector2, a: number): Vector2

  /**
   * Rotates a vector around a given point.
   */
  rotateAbout(v: Vector2, cp: Vector2, a: number): Vector2

  /**
   * Gets the midpoint of two vectors
   */
  midpoint(v: Vector2, v2: Vector2): Vector2

  /**
   * Gets the distance between two vectors
   */
  dist(v: Vector2, v2: Vector2): number

  /**
   * Get the square distance between two vectors
   */
  squareDist(v: Vector2, v2: Vector2): number

  /**
   * Dot product of two vectors
   */
  dot(v: Vector2, v2: Vector2): number

  /**
   * Determinant of a matrix
   */
  det(m: Matrix2x3): number

  /**
   * Inverts a 3x3 matrix, returning null if the determinant is zero
   * (indicating a degenerate transformation)
   */
  matrixInvert(a: Matrix2x3): Matrix2x3 | null

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
  matrixBuilder(m?: Matrix2x3): Matrix2x3Builder

  /**
   * Represent a matrix as a CSS transform `matrix(...)` string
   */
  toCSS(matrix: Matrix2x3): string

  /**
   * Returns identity matrix
   */
  identity(): Matrix2x3
}
