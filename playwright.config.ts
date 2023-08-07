import { defineConfig } from "@playwright/experimental-ct-react"
import { devices, ViewportSize } from "@playwright/test"

const viewport: ViewportSize = { width: 500, height: 500 }

export default defineConfig({
  testDir: "./e2e",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: undefined,
  reporter: "html",
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",

    ctViteConfig: {
      resolve: {
        alias: {
          mafs: "src/index.tsx",
        },
      },
    },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport } },
    { name: "firefox", use: { ...devices["Desktop Firefox"], viewport } },
    { name: "webkit", use: { ...devices["Desktop Safari"], viewport } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"], viewport } },
    { name: "Mobile Safari", use: { ...devices["iPhone 12"], viewport } },
  ],
})
