"use client"
import { useSelectedLayoutSegments } from "next/navigation"
import { getDocContext } from "./guides"

export default function Head() {
  const [_, sectionTitleKebab, guideTitleKebab] = useSelectedLayoutSegments()
  const { current } = getDocContext(sectionTitleKebab, guideTitleKebab)

  return (
    <>
      <title>{`${current.guideTitle} / ${current.sectionTitle} / Mafs`}</title>
    </>
  )
}
