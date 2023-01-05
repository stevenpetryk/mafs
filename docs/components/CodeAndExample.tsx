"use client"

import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import * as React from "react"
import { HighlightedCode } from "./Code"
import { StackBlitzIcon } from "./icons"

import sdk from "@stackblitz/sdk"

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
          md:rounded-b-lg
        `}
        >
          <div
            className={`
            p-3 sm:p-6
            refractor-highlight
            ${collapsible ? "pb-12 sm:pb-12" : ""}
            ${expanded ? "overflow-auto" : "max-h-[200px] overflow-hidden"}
          `}
          >
            <pre className={`transition ${expanded ? "" : "opacity-40"}`}>
              <code className="language-tsx">
                <HighlightedCode source={source} language="tsx" />
              </code>
            </pre>
          </div>

          <div
            className="sticky flex text-sm items-center justify-center gap-4 bottom-0 left-0 p-4 right-0"
            aria-hidden="true"
          >
            {collapsible && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className={`
                bg-white text-black
                hover:bg-gray-200 focus:bg-gray-200
                font-semibold
                flex gap-2 items-center
                shadow-xl
                px-4 py-2 rounded-full`}
              >
                <span>Show {expanded ? "less" : "all"}</span>
                {expanded ? <MinusIcon /> : <PlusIcon />}
              </button>
            )}

            <button
              type="button"
              onClick={() => openPlayground(source)}
              className="absolute right-5 flex gap-2 items-center bg-white bg-opacity-10 px-4 py-2 rounded-full"
            >
              <StackBlitzIcon />
              <span>Open in StackBlitz</span>
            </button>
          </div>
        </div>
        <span aria-hidden={true} className="syntax-badge">
          TSX
        </span>
      </div>
    </div>
  )
}

function openPlayground(source: string) {
  const functionName = source.match(/function ([A-z]+)/)?.[1]

  sdk.openProject({
    title: "Mafs Playground",
    description: "",
    template: "create-react-app",
    dependencies: {
      mafs: "latest",
      typescript: "4.9.4",
    },
    files: {
      "src/index.js": `
        import {createRoot} from "react-dom/client"
        ${source.includes("* as React") ? "" : 'import * as React from "react"'}

        ${source}

        createRoot(document.getElementById("root")).render(<${functionName} />)
      `,
      "public/index.html": "<div id='root'></div>",
    },
  })
}

export default CodeAndExample
