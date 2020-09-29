declare module "vec-la-fp" {
  type Vector = [number, number]
  type Matrix = [number, number, number, number, number, number, number, number, number]

  function add(v: Vector, v2: Vector): Vector
  function add3(v: Vector, v2: Vector, v3: Vector): Vector
  function addAll(vectors: Vector[]): Vector
  function sub(v: Vector, v2: Vector): Vector
  function sub3(v: Vector, v2: Vector, v3: Vector): Vector
  function subAll(vectors: Vector[]): Vector
  function mag(v: Vector): number
  function normal(v: Vector): Vector
  function scale(v: Vector, sc: number): Vector
  function towards(t: number, v: Vector, v2: Vector): Vector
  function lerp(v: Vector, v2: Vector, t: number): Vector
  function scalarNear(e: number, n: number, n2: number): boolean
  function near(e: number, v: Vector, v2: Vector): boolean
  function clampMag(min: number, max: number, v: Vector): Vector
  function norm(v: Vector): Vector
  const mId: Matrix
  function createMatrix(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix
  function transform(v: Vector, matrix: Matrix): Vector
  function compose(m: Matrix, m2: Matrix): Matrix
  function mRotate(a: number, m: Matrix): Matrix
  function mTranslate(v: Vector, m: Matrix): Matrix
  function mScale(v: Vector, m: Matrix): Matrix
  function mShear(v: Vector, m: Matrix): Matrix
  function rotate(a: number, v: Vector): Vector
  function rotatePointAround(a: number, cp: Vector, v: Vector): Vector
  function midpoint(v: Vector, v2: Vector): Vector
  function alongAngle(v: Vector, v2: Vector): Vector
  function dist(v: Vector, v2: Vector): number
  function fastDist(v: Vector, v2: Vector): number
  function dot(v: Vector, v2: Vector): number
  function perpDot(v: Vector, v2: Vector): number
  function triangleArea(a: Vector, b: Vector, c: Vector): number
  function colinear(a: Vector, b: Vector, c: Vector): number
  function det(v: Vector): number
}
