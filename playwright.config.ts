import { defineConfig } from "@playwright/experimental-ct-react"
import { devices, ViewportSize } from "@playwright/test"

const viewport: ViewportSize = { width: 500, height: 500 }

export default defineConfig({
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
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport }, testDir: "./e2e" },
    { name: "firefox", use: { ...devices["Desktop Firefox"], viewport }, testDir: "./e2e" },
    { name: "webkit", use: { ...devices["Desktop Safari"], viewport }, testDir: "./e2e" },
    { name: "Mobile Chrome", use: { ...devices["Pixel 5"], viewport }, testDir: "./e2e" },
    { name: "Mobile Safari", use: { ...devices["iPhone 12"], viewport }, testDir: "./e2e" },

    {
      name: "frameworks-setup",
      use: { ...devices["Desktop Chrome"], viewport },
      testDir: "./tests",
      testMatch: "tests/frameworks/setup.ts",
    },
    {
      name: "frameworks",
      use: { ...devices["Desktop Chrome"], viewport },
      testDir: "./tests",
      testMatch: "tests/frameworks/*.spec.tsx",
      dependencies: ["frameworks-setup"],
      // Since these tests operate on the actual file system, parallelism messes them up.
      fullyParallel: false,
    },
  ],
})
