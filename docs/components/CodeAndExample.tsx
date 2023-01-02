"use client"

import * as React from "react"
import { HighlightedCode } from "./Code"

interface Props {
  source: string
  component: React.ReactNode
  clean?: boolean
}

function CodeAndExample({ source, component, clean = true }: Props) {
  if (clean) {
    const remove = [
      /\s+height=\{[^}]*\}/g,
      /\s+width=\{.*\}\s*/g,
      /.*prettier-ignore.*\n/gm,
      /^import React.* from "react"/gm,
      /^export default [A-z]+$\n/gm,
      /^export default /m,
      /"use client"/m,
    ]

    remove.forEach((regex) => {
      source = source.replace(regex, "")
    })

    source = source.replaceAll(/import \{(.|\n)*?\} from "mafs"/gm, (match) => {
      return match.replaceAll(/\s+/g, " ").replace(", }", " }")
    })

    source = source.trim()
  }

  return (
    <div className="w-auto sm:text-base text-sm -m-6 md:m-0 dark:shadow-xl">
      <div className={`unround-mafs z-10`}>{component}</div>

      <div>
        <div
          className={`
            bg-gray-900 dark:bg-black
            border-gray-900 border-t text-gray-100
            p-3 sm:p-6 max-h-[500px] overflow-x-auto
            md:rounded-b-lg

            refractor-highlight
          `}
        >
          <pre>
            <code className="language-tsx">
              <HighlightedCode source={source} language="tsx" />
            </code>
          </pre>
        </div>
        <span aria-hidden={true} className="syntax-badge">
          TSX
        </span>
      </div>
    </div>
  )
}

export default CodeAndExample
