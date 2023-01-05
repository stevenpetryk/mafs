"use client"

import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import * as React from "react"
import { HighlightedCode } from "./Code"

interface Props {
  source: string
  component: React.ReactNode
  clean?: boolean
  collapsible?: boolean
}

function CodeAndExample({
  collapsible: collapsibleProp = true,
  source,
  component,
  clean = true,
}: Props) {
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

  const collapsible = collapsibleProp && source.split("\n").length > 10
  const [expandedState, setExpanded] = React.useState(false)
  const expanded = collapsible ? expandedState : true

  return (
    <div className="w-auto sm:text-base text-sm -m-6 md:m-0 dark:shadow-xl">
      <div className={`unround-mafs z-10`}>{component}</div>

      <div className="relative">
        <div
          className={`
            bg-gray-900 dark:bg-black
            border-gray-900 border-t text-gray-100
            p-3 sm:p-6
            md:rounded-b-lg
            refractor-highlight
            ${collapsible ? "pb-12 sm:pb-12" : ""}
            ${expanded ? "overflow-auto" : "max-h-[200px] overflow-clip"}
          `}
        >
          <pre className={`transition ${expanded ? "" : "opacity-40"}`}>
            <code className="language-tsx">
              <HighlightedCode source={source} language="tsx" />
            </code>
          </pre>
        </div>

        <div
          className="flex items-center justify-center absolute bottom-5 left-0 right-0"
          aria-hidden="true"
        >
          {collapsible && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={`
                bg-white text-black
                hover:bg-gray-200 focus:bg-gray-200
                font-semibold text-sm
                flex gap-2 items-center
                shadow-xl
                px-4 py-2 rounded-full`}
            >
              <span>Show {expanded ? "less" : "all"}</span>
              {expanded ? <MinusIcon /> : <PlusIcon />}
            </button>
          )}
        </div>

        <span aria-hidden={true} className="syntax-badge">
          TSX
        </span>
      </div>
    </div>
  )
}

export default CodeAndExample
