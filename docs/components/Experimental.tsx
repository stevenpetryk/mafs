import * as React from "react"

function Experimental({ children }: React.PropsWithChildren) {
  return (
    <div className="bg-red-200 dark:bg-opacity-5 -m-6 md:m-0 p-6 md:rounded-lg space-y-2 text-red-900 dark:text-red-200">
      <h2 className="text-xl text-red-900 dark:text-red-200">
        <span aria-hidden="true">🛠️</span> Experimental
      </h2>

      {children}

      <p>
        <a
          className="text-red-900 font-bold"
          href="https://github.com/stevenpetryk/mafs/issues"
          target="_blank"
          rel="noreferrer"
        >
          Make suggestions on GitHub <span aria-hidden="true">↗</span>
        </a>
      </p>
    </div>
  )
}

export default Experimental
