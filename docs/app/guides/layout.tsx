"use client"
import GuidesSidebar from "./sidebar"
import { getDocContext } from "./guides"
import { useSelectedLayoutSegments } from "next/navigation"
import Link from "next/link"
import fancyFx from "../../helpers/fancyFx"

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  const [sectionTitleKebab, guideTitleKebab] = useSelectedLayoutSegments()

  const { current, next, previous } = getDocContext(sectionTitleKebab, guideTitleKebab)

  return (
    <>
      <div className="max-w-5xl p-6 py-12 mx-auto md:flex space-y-6 md:space-y-0 md:space-x-6">
        <div
          className={`
            rounded-md
            flex-shrink-0

            bg-gray-200 dark:bg-gray-800 dark:border-gray-700 border md:bg-transparent md:border-none
            md:w-56 mb-12

            md:pb-12 md:pr-4
          `}
        >
          <GuidesSidebar />
        </div>

        <main className="space-y-6 flex-grow md:w-0">
          <h1>{fancyFx(current.guideTitle)}</h1>

          <div className="prose space-y-6">{children}</div>

          {/* A little next/prev button set  (but only if those links exist) */}
          <div className="hidden sm:flex gap-4">
            {previous && <NavButton dir="prev" href={previous.url} {...previous} />}
            <div className="ml-auto" />
            {next && <NavButton dir="next" href={next.url} {...next} />}
          </div>
          <div className="flex sm:hidden flex-col gap-4">
            {next && <NavButton dir="next" href={next.url} {...next} />}
            {previous && <NavButton dir="prev" href={previous.url} {...previous} />}
          </div>
        </main>
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
        dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:border-gray-700
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
