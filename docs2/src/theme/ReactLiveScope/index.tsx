import { range } from "lodash-es"
import * as MafsRoot from "mafs"
import React from "react"
import * as vec from "vec-la"

const { Mafs, ...mafsRest } = MafsRoot

const ReactLiveScope = {
  React,
  ...React,
  Mafs,
  ...mafsRest,
  range,
  vec,
}

export default ReactLiveScope
