import * as React from "react"

export interface CircleProps {
  radius: number
  x: number
  y: number
}

export function Circle({ radius, x, y }: CircleProps) {
  return <circle />
}
