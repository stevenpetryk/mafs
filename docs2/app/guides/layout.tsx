"use client"
import GuidesSidebar from "./sidebar"
import { getDocContext, Guides } from "./guides"
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

            bg-gray-200 border md:bg-transparent md:border-none
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
          <div className="flex gap-4">
            {previous && <NavButton dir="prev" href={previous.url} {...previous} />}

            <div className="ml-auto" />

            {next && <NavButton dir="next" href={next.url} {...next} />}
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
      className="py-3 px-6 text-slate-800 no-underline rounded-lg font-semibold bg-slate-50 border-2 border-transparent
      hover:bg-slate-100 hover:border-slate-200"
    >
      <div className="flex items-center gap-4 leading-tight">
        {dir === "prev" && (
          <div className="text-lg" aria-hidden="true">
            ←
          </div>
        )}

        <div className="flex flex-col">
          <div className="text-sm font-normal">{sectionTitle}</div>
          <div className="min-w-[10ch]">{fancyFx(guideTitle)}</div>
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
