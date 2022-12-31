"use client"

import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

type GuideLinkProps = React.PropsWithChildren<{
  sectionTitle: string
  guideTitle: string
}>

export function GuideLink({ sectionTitle, guideTitle, children }: GuideLinkProps) {
  const segments = useSelectedLayoutSegments()
  const active = segments[0] === sectionTitle && segments[1] === guideTitle

  return (
    <li>
      <Link
        href={`/guides/${sectionTitle}/${guideTitle}`}
        className={`
          block
          hover:text-blue-700 focus:text-blue-700
          hover:underline
          dark:text-slate-300 dark:focus:text-indigo-300 dark:hover:text-indigo-300
          ${active ? "text-blue-700 dark:text-indigo-300 font-bold active-sidebar-link" : ""}`}
      >
        {children}
      </Link>
    </li>
  )
}
