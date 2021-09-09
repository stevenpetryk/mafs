import { Matrix } from "vec-la"

export type Vector2 = [x: number, y: number]
export type Interval = [min: number, max: number]

/** Inverts a 3x3 matrix */
export function matrixInvert(matrix: Matrix) {
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
