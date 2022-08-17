import * as React from "react"

import hljs from "highlight.js"

import dedent from "dedent"

interface CodeProps {
  language: "tsx" | "css" | "bash"
  source: string
}

const Code: React.VFC<CodeProps> = ({ language, source }) => {
  const codeRef = React.useRef<HTMLPreElement>(null)

  React.useEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current)
    }
  }, [source])

  return (
    <div className="bg-gray-900 text-gray-100 overflow-hidden text-sm -m-6 md:m-0 sm:text-base md:rounded-lg">
      <span aria-hidden={true} className="syntax-badge">
        {language.toUpperCase()}
      </span>
      <div className="p-3 sm:p-6 overflow-x-auto">
        <pre>
          <code ref={codeRef} className={`language-${language}`}>
            {dedent(source)}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default Code
