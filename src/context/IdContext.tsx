import * as React from "react"

const IdContext = React.createContext<Record<string, number>>({})

export function useId(key: string): number | undefined {
  const context = React.useContext(IdContext)
  const [id, setId] = React.useState<number>()

  React.useEffect(() => {
    if (!id) {
      if (!context[key]) {
        context[key] = 0
      }

      setId(context[key]++)
    }
  }, [id, context, key])

  return id
}

export default IdContext
