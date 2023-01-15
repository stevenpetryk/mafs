import * as React from "react"
import invariant from "tiny-invariant"

interface SpanContextShape {
  xSpan: number
  ySpan: number
}

export const SpanContext = React.createContext<SpanContextShape | null>({
  xSpan: 0,
  ySpan: 0,
})

SpanContext.displayName = "SpanContext"

export function useSpanContext(): SpanContextShape {
  const context = React.useContext(SpanContext)
  invariant(context, "SpanContext is not defined")
  return context
}
