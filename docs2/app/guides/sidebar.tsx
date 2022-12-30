import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"
import fancyFx from "../../helpers/fancyFx"

import { Guides } from "./guides"
import path from "path"
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

  return (
    <nav>
      <details className="md:hidden space-y-4">
        <summary className="text-xl font-bold p-4 cursor-default">All guides</summary>
        <div className="p-4 pt-0 space-y-4">{sectionsElements}</div>
      </details>

      <div className="hidden md:block space-y-4">{sectionsElements}</div>
    </nav>
  )
}

export default GuidesSidebar
