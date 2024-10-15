import { test, expect } from "@playwright/test"
import { spawn } from "node:child_process"
import path from "node:path"
import { setTimeout } from "node:timers/promises"

test("vite", async ({ page }) => {
  const PORT = 4000
  // Let's start up the Vite dev server
  const pd = spawn(`npm`, [`run dev --port ${PORT}`], {
    cwd: path.join(import.meta.dirname, "./vite"),
    stdio: "pipe",
    shell: true,
  })

  console.time("waiting")
  await setTimeout(20_000)
  console.timeEnd("waiting")

  await page.goto(`http://localhost:${PORT}`)
  await expect(page).toHaveTitle("Vite App")

  pd.kill("SIGINT")
})
