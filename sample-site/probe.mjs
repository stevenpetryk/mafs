/* global getComputedStyle */

import { chromium } from "@playwright/test"

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text())
})
page.on("pageerror", (error) => errors.push(String(error)))

await page.goto(globalThis.process.env.MAFS_DEMO_URL ?? "http://localhost:4173", {
  waitUntil: "networkidle",
})

async function activate(id) {
  const section = page.locator(`#${id}`)
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(160)
  return section
}

const clickSection = await activate("clicks")
const clickSvg = clickSection.locator("svg")
const clickBox = await clickSvg.boundingBox()
if (!clickBox) throw new Error("click demo did not render an SVG")

const clickTarget = { x: clickBox.x + clickBox.width * 0.7, y: clickBox.y + clickBox.height * 0.35 }
const clickExpected = await clickSvg.evaluate((svg, target) => {
  const ctm = svg.getScreenCTM()
  const point = svg.createSVGPoint()
  point.x = target.x
  point.y = target.y
  const svgPoint = point.matrixTransform(ctm.inverse())
  const transform = getComputedStyle(svg).getPropertyValue("--mafs-view-transform")
  const [, scaleX, scaleY] = transform.match(/matrix\(([^,]+),[^,]+,[^,]+,([^,]+),/) || []
  return {
    x: svgPoint.x / Number(scaleX),
    y: svgPoint.y / Number(scaleY),
  }
}, clickTarget)

await page.mouse.click(clickTarget.x, clickTarget.y)
await page.waitForTimeout(100)
const clickAfter = await clickSection.locator("text").filter({ hasText: "," }).first().textContent()

const keyboardSection = await activate("keyboard")
const keyboardSvg = keyboardSection.locator("svg")
const keyboardBefore = await keyboardSvg.getAttribute("viewBox")
await keyboardSection.locator(".MafsView").focus()
await page.keyboard.press("ArrowRight")
await page.waitForTimeout(80)
const keyboardAfter = await keyboardSvg.getAttribute("viewBox")

const arrowSection = await activate("axis-arrows")
const arrowSvg = arrowSection.locator("svg")
const arrowBox = await arrowSvg.boundingBox()
if (!arrowBox) throw new Error("axis demo did not render an SVG")
await page.mouse.move(arrowBox.x + arrowBox.width / 2, arrowBox.y + arrowBox.height / 2)
await page.mouse.down()
await page.mouse.move(arrowBox.x + arrowBox.width / 2 + 220, arrowBox.y + arrowBox.height / 2, {
  steps: 12,
})
await page.mouse.up()
await page.waitForTimeout(80)
const arrowCheck = await arrowSvg.evaluate((svg) => {
  const [x, y, width, height] = svg.getAttribute("viewBox").split(" ").map(Number)
  const paths = [...svg.querySelectorAll("path")].map((path) => path.getAttribute("d") || "")
  const xRight = Number((paths[0].match(/M ([^ ]+) 0 l -12/) || [])[1])
  const xLeft = Number((paths[0].match(/M [^ ]+ 0 l -12 -5 v 10 Z M ([^ ]+)/) || [])[1])
  const yTop = Number((paths[1].match(/M 0 ([^ ]+) l -5/) || [])[1])
  const yBottom = Number((paths[1].match(/M 0 [^ ]+ l -5 12 h 10 Z M 0 ([^ ]+)/) || [])[1])
  return {
    left: xLeft,
    right: xRight,
    viewLeft: x,
    viewRight: x + width,
    top: yTop,
    bottom: yBottom,
    viewTop: y,
    viewBottom: y + height,
  }
})

const latexSection = await activate("latex")
const latexSvg = latexSection.locator("svg")
const latex = latexSection.locator(".mafs-latex-label").first()
const latexBefore = await latex.boundingBox()
const latexBox = await latexSvg.boundingBox()
if (!latexBefore || !latexBox) throw new Error("LaTeX demo did not render")
async function measureLatexAnchor() {
  return latexSvg.evaluate((svg) => {
    const transform = getComputedStyle(svg).getPropertyValue("--mafs-view-transform")
    const values = transform
      .match(/matrix\(([^)]+)\)/)?.[1]
      .split(",")
      .map(Number)
    const screenTransform = svg.getScreenCTM()
    const content = document.querySelector("#latex .mafs-latex-label")
    if (!values || values.length !== 6 || !screenTransform || !content) return null

    const [a, b, c, d, e, f] = values
    const pixelPoint = svg.createSVGPoint()
    pixelPoint.x = a * 0 + c * 1.4 + e
    pixelPoint.y = b * 0 + d * 1.4 + f
    const screenPoint = pixelPoint.matrixTransform(screenTransform)
    const contentBox = content.getBoundingClientRect()
    const contentCenter = [
      contentBox.x + contentBox.width / 2,
      contentBox.y + contentBox.height / 2,
    ]
    return Math.hypot(contentCenter[0] - screenPoint.x, contentCenter[1] - screenPoint.y)
  })
}

const latexAnchorError = await measureLatexAnchor()
const latexPosition = await latex.evaluate((element) => getComputedStyle(element).position)
if (latexPosition !== "absolute") throw new Error(`LaTeX label is ${latexPosition}, not absolute`)
const latexX = latexBox.x + latexBox.width * 0.2
const latexY = latexBox.y + Math.min(150, latexBox.height / 2)
await page.mouse.move(latexX, latexY)
await page.mouse.down()
await page.mouse.move(latexX + 80, latexY, { steps: 10 })
await page.mouse.up()
await page.waitForTimeout(80)
const latexAfter = await latex.boundingBox()
const latexVerticalX = latexBox.x + latexBox.width / 2
const latexVerticalY = latexBox.y + Math.min(220, latexBox.height / 2)
await page.mouse.move(latexVerticalX, latexVerticalY)
await page.mouse.down()
await page.mouse.move(latexVerticalX, latexVerticalY + 80, { steps: 10 })
await page.mouse.up()
await page.waitForTimeout(80)
const latexAfterVerticalPan = await latex.boundingBox()

await page.setViewportSize({ width: 960, height: 760 })
await page.waitForTimeout(160)
const latexResizeAnchorError = await measureLatexAnchor()
await page.evaluate(() => {
  document.documentElement.style.zoom = "2"
})
await page.waitForTimeout(160)
const latexZoomAnchorError = await measureLatexAnchor()
await page.evaluate(() => {
  document.documentElement.style.zoom = ""
})

if (
  [latexAnchorError, latexResizeAnchorError, latexZoomAnchorError].some(
    (error) => error === null || error > 1,
  )
) {
  throw new Error("LaTeX overlay lost its graph anchor during pan, resize, or zoom")
}

const animationSection = await activate("animation")
const animationButton = animationSection.locator("button")
if ((await animationButton.textContent())?.includes("Pause")) await animationButton.click()
const slider = animationSection.locator("input[type=range]")
const sliderBox = await slider.boundingBox()
if (!sliderBox) throw new Error("animation slider did not render")
const sliderTarget = 0.82
await page.mouse.click(
  sliderBox.x + sliderBox.width * sliderTarget,
  sliderBox.y + sliderBox.height / 2,
)
await page.waitForTimeout(80)
const sliderValue = Number(await slider.inputValue())

const plotSection = await activate("plot-quality")
const plotSvg = plotSection.locator("svg")
const plotBox = await plotSvg.boundingBox()
if (!plotBox) throw new Error("plot demo did not render")
const plotPathCountBefore = await plotSvg.locator("path").count()
for (let index = 0; index < 3; index++) {
  const x = plotBox.x + plotBox.width / 2
  const y = plotBox.y + plotBox.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x - 500, y, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(60)
}
const plotPathCountAfter = await plotSvg.locator("path").count()

console.log(
  JSON.stringify(
    {
      clickExpected,
      clickAfter,
      keyboardMoved: keyboardBefore !== keyboardAfter,
      arrowCheck,
      latexAnchorError,
      latexShift: latexAfter ? latexAfter.x - latexBefore.x : null,
      latexVerticalShift: latexAfterVerticalPan
        ? latexAfterVerticalPan.y - (latexAfter?.y ?? 0)
        : null,
      latexPosition,
      latexResizeAnchorError,
      latexZoomAnchorError,
      latexSpans: await latexSection.locator(".mafs-latex-label span").count(),
      sliderValue,
      sliderTarget,
      plotPathCountBefore,
      plotPathCountAfter,
      errors,
    },
    null,
    2,
  ),
)

await browser.close()
