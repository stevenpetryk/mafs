import { chromium } from "@playwright/test"

const errors = []

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })

page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text())
})
page.on("pageerror", (err) => errors.push(String(err)))

await page.goto("http://localhost:4173", { waitUntil: "networkidle" })

const sectionCount = await page.locator("section.section").count()
for (let index = 0; index < sectionCount; index++) {
  const section = page.locator("section.section").nth(index)
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(100)
}

const mafsViews = await page.locator(".MafsView").count()
const svgs = await page.locator(".MafsView svg").count()
const sections = sectionCount

await page.screenshot({ path: "demo-full.png", fullPage: true })

const shots = [
  ["01-foundations", "#foundations .section-demo"],
  ["03-discontinuities", "#discontinuities .section-demo"],
  ["04-vector-field", "#vectors .section-demo"],
  ["07-movables", "#movables .section-demo"],
  ["13-transform", "#transform-composition .section-demo"],
  ["15-latex", "#latex .section-demo"],
]
for (const [name, sel] of shots) {
  const demo = page.locator(sel)
  await demo.scrollIntoViewIfNeeded()
  await page.waitForTimeout(150)
  await demo.screenshot({ path: "demo-" + name + ".png" })
}

console.log(JSON.stringify({ mafsViews, svgs, sections, errors }, null, 2))
await browser.close()
