"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import { getDocContext } from "./guides"

export default function Head() {
  const [_, sectionTitleKebab, guideTitleKebab] = useSelectedLayoutSegments()
  const { current } = getDocContext(sectionTitleKebab, guideTitleKebab)

  return (
    <>
      <title>{`${current.guideTitle} | ${current.sectionTitle} | Mafs: React components for interactive math`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href={"/favicon.svg"} />
    </>
  )
}
