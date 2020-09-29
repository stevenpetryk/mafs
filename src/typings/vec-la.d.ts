declare module "vec-la" {
  type Vector = [number, number]
  type Matrix = [number, number, number, number, number, number, number, number, number]

  interface MatrixBuilder {
    scale(x: number, y: number): MatrixBuilder
    rotate(a: number): MatrixBuilder
    shear(x: number, y: number): MatrixBuilder
    translate(x: number, y: number): MatrixBuilder
    add(m: Matrix): MatrixBuilder
    get(): Matrix
  }

  function add(v: Vector, v2: Vector): Vector
  function sub(v: Vector, v2: Vector): Vector
  function scale(v: Vector, sc: number): Vector
  function midpoint(v: Vector, v2: Vector): Vector
  function norm(v: Vector): Vector
  function mag(v: Vector): number
  function normal(v: Vector): Vector
  function towards(v: Vector, v2: Vector, t: number): Vector
  function rotate(v: Vector, a: number): Vector
  function rotatePointAround(v: Vector, cp: Vector, a: number): Vector
  function dot(v: Vector, v2: Vector): number
  function det(v: Vector): number
  function dist(v: Vector, v2: Vector): number
  function matrixBuilder(): MatrixBuilder
  function createMatrix(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix
  function transform(v: Vector, matrix: Matrix): Vector
  function composeTransform(m: Matrix, m2: Matrix): Matrix

  interface MatrixBuilder {
    scale(x: number, y: number): MatrixBuilder
    get(): Matrix
  }
}
