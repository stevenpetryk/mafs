import { expect, test } from "@playwright/experimental-ct-react"
import { MafsDragging } from "./components/MafsDragging"

test("Panning the <Mafs /> view", async ({ mount, page }) => {
  const component = await mount(<MafsDragging />)
  await page.waitForSelector(".MafsView")

  await component.focus()
  await page.keyboard.press("Alt+ArrowRight")
  await expect(page).toHaveScreenshot("after-option-arrow.png")
  await page.keyboard.press("ArrowRight")
  await expect(page).toHaveScreenshot("after-arrow.png")
  await page.keyboard.press("Shift+ArrowRight")
  await expect(page).toHaveScreenshot("after-shift-arrow.png")
})
