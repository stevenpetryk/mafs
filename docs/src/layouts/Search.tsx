import * as React from "react"

import SlashImage from "./slash.svg"

export const Search: React.VFC = () => {
  const input = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    function trigger(event: KeyboardEvent) {
      if (!input.current) return

      if (eventShouldTrigger(event)) {
        event.preventDefault()
        input.current.select()
      }
    }
    window.addEventListener("keydown", trigger)
    return () => {
      window.removeEventListener("keydown", trigger)
    }
  })

  return (
    <input
      ref={input}
      type="text"
      className={`
          block py-3 px-4 rounded-lg w-full
          pl-12
          placeholder-gray-600
          border border-gray-400
          shadow-sm
          outline-none focus:ring focus:border-blue-400
          bg-no-repeat bg-left-nudge
        `}
      style={{
        backgroundImage: `url(${SlashImage})`,
      }}
      placeholder="Search the docs..."
    />
  )
}

function eventShouldTrigger(event: KeyboardEvent): boolean {
  return event.key === "/" && event.target === document.body
}
