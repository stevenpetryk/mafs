"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import fancyFx from "../../helpers/fancyFx"
import { getDocContext } from "./guides"

export function Title() {
  const [sectionTitleKebab, guideTitleKebab] = useSelectedLayoutSegments()
  const { current } = getDocContext(sectionTitleKebab, guideTitleKebab)

  return (
    <>
      {current.icon && (
        <div className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100 p-1 rounded-lg">
          <current.icon className="block w-[30px] h-[30px]" />
        </div>
      )}
      {fancyFx(current.guideTitle)}
    </>
  )
}
