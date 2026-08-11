import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    // The Mafs source imports React from the repo root; make sure the site
    // only ever uses a single copy of React.
    dedupe: ["react", "react-dom"],
    alias: {
      mafs: resolve(__dirname, "../src/index.tsx"),
    },
  },
})
