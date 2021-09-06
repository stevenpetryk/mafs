import React from "react"

import dedent from "dedent"

interface CodeProps {
  language: string
  source: string
}

const Code: React.VFC<CodeProps> = ({ language, source }) => (
  <div className="bg-gray-900 text-gray-100 overflow-hidden text-sm -m-6 md:m-0 sm:text-base md:rounded-lg">
    <span aria-hidden={true} className="syntax-badge">
      {language.toUpperCase()}
    </span>
    <div className="p-3 sm:p-6 overflow-x-auto">
      <Highlight language={language}>{dedent(source)}</Highlight>
    </div>
  </div>
)

export default Code
