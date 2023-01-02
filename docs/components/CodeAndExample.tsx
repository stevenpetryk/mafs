"use client"

import * as React from "react"

import hljs from "highlight.js"

interface Props {
  source: string
  component: React.ReactNode
  clean?: boolean
}

const CodeAndExample: React.VFC<Props> = ({ source, component, clean = true }) => {
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

    source = source.trim()
  }

  const codeRef = React.useRef<HTMLPreElement>(null)

  React.useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [source])

  return (
    <div className="w-auto sm:text-base text-sm -m-6 md:m-0 md:rounded-lg dark:shadow-xl">
      <div className="unround-mafs relative focus:z-10">{component}</div>

      <details>
        <summary className="p-3 cursor-pointer hover:bg-slate-700 focus:outline focus:z-10 bg-slate-800">
          Show code
        </summary>

        <div>
          <div className="bg-gray-900 dark:bg-black border-gray-800 border-t text-gray-100 p-3 sm:p-6 overflow-x-auto">
            <pre>
              <code ref={codeRef} className="language-tsx">
                {source}
              </code>
            </pre>
          </div>
          <span aria-hidden={true} className="syntax-badge">
            TSX
          </span>
        </div>
      </details>
    </div>
  )
}

export default CodeAndExample
