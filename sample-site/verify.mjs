import { chromium } from "@playwright/test"

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
await page.goto("http://localhost:4173", { waitUntil: "networkidle" })

const report = {}

async function activeDemo(selector) {
  const demo = page.locator(selector)
  await demo.scrollIntoViewIfNeeded()
  await page.waitForTimeout(150)
  return demo
}

// Vector field demo: should be ~10 path layers (one per opacity bucket), not one per arrow
report.vectorFieldPaths = await (await activeDemo("#vectors .section-demo")).locator("path").count()

// Discontinuities demo: tan plot path should contain multiple "M" subpath starts
const tanPath = await (
  await activeDemo("#discontinuities .section-demo")
)
  .locator("path")
  .first()
  .getAttribute("d")
report.tanSubpaths = (tanPath.match(/M /g) || []).length

// Text anchors demo: should have text nodes
report.textAnchorLabels = await (await activeDemo("#text .section-demo")).locator("text").count()

// Latex demo: rendered math should produce KaTeX spans inside the HTML overlay
report.latexSpans = await (
  await activeDemo("#latex .section-demo")
)
  .locator(".mafs-latex-label span")
  .count()

console.log(JSON.stringify(report, null, 2))
await browser.close()
