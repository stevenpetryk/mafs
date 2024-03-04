"use client"

import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

type GuideLinkProps = React.PropsWithChildren<{
  sectionTitle: string
  guideTitle: string
  guideSlug: string
}>

export function GuideLink({ sectionTitle, guideSlug, children }: GuideLinkProps) {
  const segments = useSelectedLayoutSegments()
  const active = segments[0] === sectionTitle && segments[1] === guideSlug

  return (
    <li>
      <Link
        href={`/guides/${sectionTitle}/${guideSlug}`}
        className={`
          flex gap-2 items-center px-2 -mx-2 py-0.5 rounded-lg
          md:hover:bg-slate-100 md:dark:hover:bg-slate-800
          hover:text-blue-700 focus:text-blue-700
          focus:z-10
          dark:text-slate-300 dark:focus:text-blue-300 dark:hover:text-blue-300
          transition
          active:scale-[0.99]
          ${
            active
              ? "text-blue-700 dark:text-blue-400 dark:focus:text-blue-400 dark:hover:text-blue-400 font-bold md:bg-slate-100 md:dark:bg-slate-800"
              : ""
          }`}
      >
        {children}
      </Link>
    </li>
  )
}
