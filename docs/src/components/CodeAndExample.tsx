import * as React from "react"
import Highlight from "react-highlight.js"

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
    ]

    remove.forEach((regex) => {
      source = source.replace(regex, "")
    })

    source = source.trim()
  }

  return (
    <div className="w-auto overflow-hidden sm:text-base text-sm -m-6 md:m-0 md:rounded-lg">
      <div className="unround-mafs">{component}</div>

      <div>
        <div className="bg-gray-900 border-gray-800 border-t text-gray-100 p-3 sm:p-6 overflow-x-auto">
          <Highlight language="tsx">{source}</Highlight>
        </div>
        <span aria-hidden={true} className="syntax-badge">
          TSX
        </span>
      </div>
    </div>
  )
}

export default CodeAndExample
