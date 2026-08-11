import { defineConfig } from "vite"

export default defineConfig({
  test: {
    dir: "src",
    // A DOM environment is needed to test hooks that render React elements.
    environment: "happy-dom",
    setupFiles: ["./src/testSetup.ts"],
  },
})
