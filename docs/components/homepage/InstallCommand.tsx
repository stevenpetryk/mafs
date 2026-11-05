"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons"

const COMMAND = "npm install mafs"

export function InstallCommand() {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(COMMAND).then(
          () => setCopied(true),
          () => {},
        )
      }}
      className="inline-flex items-center gap-3 font-mono text-sm px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      aria-label={copied ? "Copied to clipboard" : `Copy “${COMMAND}” to clipboard`}
    >
      <span className="text-gray-400 select-none" aria-hidden="true">
        $
      </span>
      <span className="text-gray-900 dark:text-gray-100">{COMMAND}</span>
      {copied ? (
        <CheckIcon className="text-green-600 dark:text-green-400" aria-hidden="true" />
      ) : (
        <CopyIcon className="text-gray-400" aria-hidden="true" />
      )}
    </button>
  )
}
