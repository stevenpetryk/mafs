"use client"

import { useSelectedLayoutSegments } from "next/navigation"
import { getDocContext } from "./guides"
import Link from "next/link"
import fancyFx from "../../helpers/fancyFx"

export function NextPrevButtons() {
  const [sectionTitleKebab, guideTitleKebab] = useSelectedLayoutSegments()
  const { next, previous } = getDocContext(sectionTitleKebab, guideTitleKebab)

  return (
    <>
      <div className="hidden sm:flex gap-4 pt-6">
        {previous && <NavButton dir="prev" href={previous.url} {...previous} />}
        <div className="ml-auto" />
        {next && <NavButton dir="next" href={next.url} {...next} />}
      </div>

      <div className="flex sm:hidden flex-col gap-4">
        {next && <NavButton dir="next" href={next.url} {...next} />}
        {previous && <NavButton dir="prev" href={previous.url} {...previous} />}
      </div>
    </>
  )
}

function NavButton({
  href,
  sectionTitle,
  guideTitle,
  dir,
}: {
  href: string
  sectionTitle: string
  guideTitle: string
  dir: "prev" | "next"
}) {
  return (
    <Link
      href={href}
      className={`
        py-3 px-6
        no-underline rounded-lg font-semibold border-2 border-transparent
        bg-gray-50 text-gray-800 hover:bg-gray-100 hover:border-gray-200
        dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800 dark:hover:border-slate-700
      `}
    >
      <div className="flex items-center justify-between sm:gap-4 leading-tight">
        {dir === "prev" && (
          <div className="text-lg" aria-hidden="true">
            ←
          </div>
        )}

        <div className="flex flex-col overflow-hidden">
          <div className="text-sm font-normal text-ellipsis  overflow-hidden whitespace-nowrap">
            {sectionTitle}
          </div>
          <div className="min-w-[10ch] text-ellipsis  overflow-hidden whitespace-nowrap">
            {fancyFx(guideTitle)}
          </div>
        </div>

        {dir === "next" && (
          <div className="text-lg" aria-hidden="true">
            →
          </div>
        )}
      </div>
    </Link>
  )
}
