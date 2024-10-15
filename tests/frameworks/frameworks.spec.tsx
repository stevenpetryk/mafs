import { ChildProcessWithoutNullStreams, execSync, spawn } from "node:child_process"
import path from "node:path"
import net from "node:net"
import { setTimeout } from "node:timers/promises"

import { test, expect, Page } from "@playwright/test"

test("vite", async ({ page }) => {
  await testDevServer(page, "./vite", "pnpm", (port) => ["run", "dev", "--port", port])
})

test("vite - prod", async ({ page }) => {
  execSync("pnpm run build", { cwd: path.join(import.meta.dirname, "./vite") })
  await testDevServer(page, "./vite", "pnpm", (port) => ["run", "preview", "--port", port])
})

test("nextjs", async ({ page }) => {
  await testDevServer(page, "./nextjs", "pnpm", (port) => ["run", "dev", "--port", port], {
    NODE_ENV: "development",
  })
})

test("nextjs - prod", async ({ page }) => {
  execSync("pnpm run build", { cwd: path.join(import.meta.dirname, "./nextjs") })
  await testDevServer(page, "./nextjs", "pnpm", (port) => ["run", "start", "--port", port], {
    NODE_ENV: "production",
  })
})

async function testDevServer(
  page: Page,
  dirname: string,
  command: string,
  args: (port) => string[],
  extraEnv: Record<string, string> = {},
) {
  const errors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text())
    }
  })

  const port = await getFreePort()

  const pd = spawn(command, args(port), {
    cwd: path.join(import.meta.dirname, dirname),
    stdio: "inherit",
    shell: true,
    env: { ...process.env, NODE_ENV: undefined, ...extraEnv } as any,
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
}

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
      srv.close(() => res(port))
    })
  })
}
