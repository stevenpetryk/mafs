export const theme = {
  foreground: "var(--mafs-fg)",
  background: "var(--mafs-bg)",

  red: "var(--mafs-red)",
  orange: "var(--mafs-orange)",
  green: "var(--mafs-green)",
  blue: "var(--mafs-blue)",
  indigo: "var(--mafs-indigo)",
  violet: "var(--mafs-violet)",
  pink: "var(--mafs-pink)",
}

export interface Filled {
  color?: string
  weight?: number
  fillOpacity?: number
  strokeOpacity?: number
  strokeStyle?: "solid" | "dashed"
}

export interface Stroked {
  color?: string
  opacity?: number
  weight?: number
  style?: "solid" | "dashed"
}
