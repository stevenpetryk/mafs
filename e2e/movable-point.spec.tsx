import { expect, test } from "@playwright/experimental-ct-react"
import { MafsDragging } from "./components/MafsDragging"

test("Moving MovablePoints", async ({ mount, page }) => {
  const component = await mount(<MafsDragging />)
  await page.waitForSelector(".mafs-movable-point")

  const points = await component.locator(".mafs-movable-point").all()
  expect(points.length).toBe(3)
  const [point1, point2, point3] = points

  await expect(page).toHaveScreenshot("before-moving.png")

  await point1.focus()
  await page.keyboard.press("ArrowRight")
  await point2.focus()
  await page.keyboard.press("Alt+ArrowRight")
  await point3.focus()
  await page.keyboard.press("Shift+ArrowRight")

  await point3.blur()
  await expect(page).toHaveScreenshot("after-moving.png")
})
