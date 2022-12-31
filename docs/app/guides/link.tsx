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
        className={`block hover:text-blue-700 focus:text-blue-700 hover:underline ${
          active ? "text-blue-700 font-bold active-sidebar-link" : ""
        }`}
      >
        {children}
      </Link>
    </li>
  )
}
