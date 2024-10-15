import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

import { Mafs } from "mafs"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Mafs />
  </StrictMode>,
)
