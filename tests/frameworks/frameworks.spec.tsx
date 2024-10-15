import { spawn } from "node:child_process"
import path from "node:path"
import net from "node:net"
import { setTimeout } from "node:timers/promises"

import { test, expect } from "@playwright/test"

test("vite", async ({ page }) => {
  let errors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text())
    }
  })

  const port = await getFreePort()

  const pd = spawn("npm", ["run", "dev", "--", "--port", String(port)], {
    cwd: path.join(import.meta.dirname, "./vite"),
    stdio: "pipe",
    shell: true,
  })

  pd.on("exit", (code, signal) => {
    if (code !== 0 && signal !== "SIGINT") {
      throw new Error(`Process exited with code ${code} and signal ${signal}`)
    }
  })

  await waitForPort(port, 10_000)

  try {
    await page.goto(`http://localhost:${port}`)
    await expect(page).toHaveScreenshot()
    await expect(page.locator("svg")).toContainText("Mafs is working!")
  } finally {
    pd.kill("SIGINT")
  }

  await expect(errors).toEqual([])
})

async function waitForPort(port: number, timeout: number) {
  const start = performance.now()
  while (performance.now() - start < timeout) {
    try {
      const response = await fetch(`http://localhost:${port}`)
      if (response.ok) {
        return
      }
    } catch (e) {
      // Ignore errors and continue polling
    }
    await setTimeout(100)
  }
  throw new Error(`Port ${port} did not start responding within ${timeout}ms`)
}

async function getFreePort(): Promise<number> {
  return new Promise((res) => {
    const srv = net.createServer()
    // Port 0 signals the OS to give us a random, available port.
    srv.listen(0, () => {
      // @ts-expect-error - don't care lol
      const port = srv.address().port
      srv.close((err) => res(port))
    })
  })
}
