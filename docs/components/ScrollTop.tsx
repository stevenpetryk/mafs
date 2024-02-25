"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import * as React from "react"
export default function ScrollTop() {
  const [sectionTitleKebab, guideTitleKebab] = useSelectedLayoutSegments()

  // A little hack to scroll to the top until https://github.com/vercel/next.js/issues/42492 is fixed
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [sectionTitleKebab, guideTitleKebab])

  return null
}
