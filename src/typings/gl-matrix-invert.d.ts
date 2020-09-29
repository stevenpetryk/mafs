declare module "gl-matrix-invert" {
  import { Matrix } from "vec-la"

  function invert(destMatrix: Matrix, matrix: Matrix): Matrix
  export default invert
}
