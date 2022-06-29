import React from "react"
import * as MafsRoot from "mafs"

const { Mafs, ...mafsRest } = MafsRoot

const ReactLiveScope = {
  React,
  ...React,
  Mafs,
  ...mafsRest,
}

export default ReactLiveScope
