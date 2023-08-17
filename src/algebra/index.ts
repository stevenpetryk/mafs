import type { Algebra, Matrix2x3 } from "./types"

export const vec: Algebra = {
  add(v, v2) {
    return [v[0] + v2[0], v[1] + v2[1]]
  },

  sub(v, v2) {
    return [v[0] - v2[0], v[1] - v2[1]]
  },

  mag(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1])
  },

  normal(v) {
    return [-v[1], v[0]]
  },

  lerp(v, v2, t) {
    const d = vec.sub(v2, v)
    const m = vec.mag(d)
    return vec.add(v, vec.withMag(d, t * m))
  },

  withMag(v, m) {
    const magnitude = vec.mag(v)
    return vec.scale(v, m / magnitude)
  },
  normalize(v) {
    return vec.withMag(v, 1)
  },

  scale(v, sc) {
    return [v[0] * sc, v[1] * sc]
  },

  transform(v, m) {
    return [v[0] * m[0] + v[1] * m[1] + m[2], v[0] * m[3] + v[1] * m[4] + m[5]]
  },

  matrixMult(m, m2) {
    return matrixCreate(
      m[0] * m2[0] + m[1] * m2[3],
      m[3] * m2[0] + m[4] * m2[3],
      m[0] * m2[1] + m[1] * m2[4],
      m[3] * m2[1] + m[4] * m2[4],
      m[0] * m2[2] + m[1] * m2[5] + m[2],
      m[3] * m2[2] + m[4] * m2[5] + m[5],
    )
  },

  rotate(v, a) {
    const c = Math.cos(a)
    const s = Math.sin(a)
    return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]
  },

  rotateAbout(v, cp, a) {
    const v2 = vec.sub(v, cp)
    return vec.add(cp, vec.rotate(v2, a))
  },

  midpoint(v, v2) {
    return vec.lerp(v, v2, 0.5)
  },

  dist(v, v2) {
    return Math.sqrt(vec.squareDist(v, v2))
  },

  squareDist(v, v2) {
    return Math.pow(v2[0] - v[0], 2) + Math.pow(v2[1] - v[1], 2)
  },

  dot(v, v2) {
    return v[0] * v2[0] + v[1] * v2[1]
  },

  det(m) {
    return m[0] * m[4] - m[3] * m[1]
  },

  matrixInvert(a) {
    // Calculate the determinant
    const mDet = vec.det(a)
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
  },

  matrixBuilder(m = matrixCreate()) {
    const _m = m

    return {
      mult: (m) => vec.matrixBuilder(vec.matrixMult(m, _m)),
      translate: (x: number, y: number) =>
        vec.matrixBuilder(vec.matrixMult(matrixCreate(1, 0, 0, 1, x, y), _m)),
      rotate: (a: number) => {
        const c = Math.cos(a)
        const s = Math.sin(a)
        return vec.matrixBuilder(vec.matrixMult(matrixCreate(c, s, -s, c), _m))
      },
      scale: (x: number, y: number) =>
        vec.matrixBuilder(vec.matrixMult(matrixCreate(x, 0, 0, y), _m)),
      shear: (x: number, y: number) =>
        vec.matrixBuilder(vec.matrixMult(matrixCreate(1, y, x, 1), _m)),
      get: () => [..._m],
    }
  },

  toCSS(matrix) {
    const [a, c, tx, b, d, ty] = matrix
    return `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`
  },

  identity: () => vec.matrixBuilder().get(),
}

/**
 * Create a matrix
 */
function matrixCreate(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0): Matrix2x3 {
  return [a, c, tx, b, d, ty]
}
