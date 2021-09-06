import React, { useEffect, useRef, useState } from "react"
import * as monaco from "monaco-editor/esm/vs/editor/editor.api"

interface Props {
  source: string
  component: React.ReactNode

  clean?: boolean
}

const CodeAndExample: React.VFC<Props> = ({ source, component, clean = true }) => {
  const [pre, setDiv] = useState<HTMLElement>(null)

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

  const theme = "vs-dark"

  useEffect(() => {
    if (!pre) return
    monaco.editor.colorizeElement(pre, { theme })
  }, [pre])

  return (
    <div className="w-auto overflow-hidden sm:text-base text-sm -m-6 md:m-0 md:rounded-lg">
      <div className="unround-mafs">{component}</div>

      <div>
        <pre
          className="bg-gray-900 border-gray-800 border-t text-gray-100 p-3 sm:p-6 overflow-x-auto"
          data-lang="text/javascript"
          ref={setDiv}
          key={[source, theme].join(":")}
        >
          {source}
        </pre>
        <span aria-hidden={true} className="syntax-badge">
          TSX
        </span>
      </div>
    </div>
  )
}

export default CodeAndExample
