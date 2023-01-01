import * as React from "react"

import fancyFx from "../../helpers/fancyFx"

import { Guides } from "./guides"
import kebabCase from "lodash/kebabCase"
import { GuideLink } from "./link"

function GuidesSidebar() {
  const sectionsElements = Guides.map((section, index) => (
    <div key={index}>
      <h2 className="text-lg font-semibold">{section.title}</h2>

      <ul>
        {section.guides.map((guideTitle, index) => (
          <GuideLink
            sectionTitle={kebabCase(section.title)}
            guideTitle={kebabCase(guideTitle)}
            key={index}
          >
            {fancyFx(guideTitle)}
          </GuideLink>
        ))}
      </ul>
    </div>
  ))

  const detailsRef = React.useRef<HTMLDetailsElement>(null)

  function handleClick(event: React.MouseEvent<HTMLDetailsElement>) {
    if (!detailsRef.current) return

    const links = detailsRef.current.querySelectorAll("a")
    const linkClicked = Array.from(links).some((link) => link.contains(event.target as Node))
    if (!linkClicked) return

    if (detailsRef.current?.open) {
      detailsRef.current.open = false
    }
  }

  return (
    <nav className="relative">
      <SkipLink />

      <details ref={detailsRef} onClick={handleClick} className="md:hidden space-y-4 border-0">
        <summary className="text-xl font-bold p-4 cursor-default">All guides</summary>
        <div className="p-4 pt-0 space-y-4">{sectionsElements}</div>
      </details>

      <div className="hidden md:block space-y-4">{sectionsElements}</div>
    </nav>
  )
}

export default GuidesSidebar
function SkipLink() {
  return (
    <a
      href="#main"
      className={`
          absolute opacity-0 pointer-events-none
          focus:pointer-events-auto
          top-0 left-0 right-0 text-center
          px-4 py-2 text-sm font-semibold
          bg-gray-50 dark:bg-slate-800
          focus:opacity-100
          z-10
        `}
    >
      Skip to main content
    </a>
  )
}
