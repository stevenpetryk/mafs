import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { Coordinates, Mafs, Text } from "mafs"

import "./index.css"
import "mafs/core.css"
import "mafs/font.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Mafs>
      <Coordinates.Cartesian />
      <Text x={0} y={0}>
        Mafs is working!
      </Text>
    </Mafs>
  </StrictMode>,
)
