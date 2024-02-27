"use client"

import * as React from "react"
import endent from "endent"
import { toH } from "hast-to-hyperscript"

import { refractor } from "refractor"
import bash from "refractor/lang/bash"
import css from "refractor/lang/css"
import diff from "refractor/lang/diff"
import tsx from "refractor/lang/tsx"

refractor.register(bash)
refractor.register(css)
refractor.register(diff)
refractor.register(tsx)

interface CodeProps {
  language: "tsx" | "css" | "bash" | "diff"
  source: string
}

function Code({ language, source }: CodeProps) {
  const codeRef = React.useRef<HTMLPreElement>(null)

  return (
    <div className="bg-gray-900 dark:bg-black dark:shadow-md text-gray-100 overflow-hidden text-sm -m-6 md:m-0 sm:text-base md:rounded-lg">
      <span aria-hidden={true} className="syntax-badge">
        {language.toUpperCase()}
      </span>
      <div className="p-3 sm:p-6 overflow-x-auto refractor-highlight">
        <pre>
          <code ref={codeRef} className={`language-${language}`}>
            {/* @ts-expect-error - `endent` has weird types but it works */}
            <HighlightedCode source={endent(source)} language={language} />
          </code>
        </pre>
      </div>
    </div>
  )
}

export default Code

export function HighlightedCode({ source, language }: { language: string; source: string }) {
  const tree = refractor.highlight(source, language)
  // @ts-expect-error - idk
  const node = toH(React.createElement, tree)

  return node
}
