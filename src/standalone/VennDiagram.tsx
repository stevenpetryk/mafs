import * as React from "react"
import { Theme } from "../display/Theme"

/** A set in the Venn diagram */
export interface VennSet {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Elements in this set */
  elements: (string | number)[]
  /** Set color (default: Theme.blue) */
  color?: string
}

/** Which region(s) to highlight */
export type VennHighlight = "intersection" | "union" | "difference" | "complement" | string

/** Props for the VennDiagram component */
export interface VennDiagramProps {
  /** Sets to display (2 or 3) */
  sets: VennSet[]
  /** Regions to highlight */
  highlights?: VennHighlight[]
  /** Whether to show element values inside regions (default: true) */
  showElements?: boolean
  /** Whether regions are clickable to toggle highlights (default: false) */
  interactive?: boolean
  /** Width in pixels (default: 400) */
  width?: number
  /** Height in pixels (default: 300) */
  height?: number
  /** Called when highlights change in interactive mode */
  onHighlightChange?: (highlights: VennHighlight[]) => void
}

function computeSetElements(sets: VennSet[]): {
  onlyA: (string | number)[]
  onlyB: (string | number)[]
  onlyC: (string | number)[]
  ab: (string | number)[]
  ac: (string | number)[]
  bc: (string | number)[]
  abc: (string | number)[]
} {
  const a = new Set(sets[0]?.elements ?? [])
  const b = new Set(sets[1]?.elements ?? [])
  const c = new Set(sets[2]?.elements ?? [])

  const abc = [...a].filter((x) => b.has(x) && c.has(x))
  const abOnly = [...a].filter((x) => b.has(x) && !c.has(x))
  const acOnly = [...a].filter((x) => !b.has(x) && c.has(x))
  const bcOnly = [...b].filter((x) => !a.has(x) && c.has(x))
  const onlyA = [...a].filter((x) => !b.has(x) && !c.has(x))
  const onlyB = [...b].filter((x) => !a.has(x) && !c.has(x))
  const onlyC = [...c].filter((x) => !a.has(x) && !b.has(x))

  return { onlyA, onlyB, onlyC, ab: abOnly, ac: acOnly, bc: bcOnly, abc }
}

function isHighlighted(regionId: string, highlights: VennHighlight[], sets: VennSet[]): boolean {
  for (const h of highlights) {
    if (h === regionId) return true
    if (h === "intersection" && regionId === "ab") return true
    if (h === "intersection" && regionId === "abc") return true
    if (h === "union" && ["onlyA", "onlyB", "onlyC", "ab", "ac", "bc", "abc"].includes(regionId))
      return true
    if (h === "difference" && regionId === "onlyA") return true
    if (h === sets[0]?.id && ["onlyA", "ab", "ac", "abc"].includes(regionId)) return true
    if (h === sets[1]?.id && ["onlyB", "ab", "bc", "abc"].includes(regionId)) return true
    if (sets[2] && h === sets[2].id && ["onlyC", "ac", "bc", "abc"].includes(regionId)) return true
  }
  return false
}

/**
 * A standalone Venn diagram visualization supporting 2 or 3 sets.
 * Displays set elements in the correct regions, supports interactive
 * region clicking, and highlights union/intersection/difference.
 */
export function VennDiagram({
  sets,
  highlights: controlledHighlights,
  showElements = true,
  interactive = false,
  width = 400,
  height = 300,
  onHighlightChange,
}: VennDiagramProps) {
  const [internalHighlights, setInternalHighlights] = React.useState<VennHighlight[]>(
    controlledHighlights ?? [],
  )
  const highlights = controlledHighlights ?? internalHighlights

  const is3Set = sets.length >= 3
  const cx = width / 2
  const cy = height / 2
  const r = Math.min(width, height) * 0.28

  // Circle positions
  const circles = React.useMemo(() => {
    if (is3Set) {
      const offset = r * 0.45
      return [
        { x: cx - offset, y: cy - offset * 0.5, color: sets[0]?.color ?? Theme.blue },
        { x: cx + offset, y: cy - offset * 0.5, color: sets[1]?.color ?? Theme.pink },
        { x: cx, y: cy + offset * 0.6, color: sets[2]?.color ?? Theme.green },
      ]
    }
    return [
      { x: cx - r * 0.35, y: cy, color: sets[0]?.color ?? Theme.blue },
      { x: cx + r * 0.35, y: cy, color: sets[1]?.color ?? Theme.pink },
    ]
  }, [cx, cy, r, is3Set, sets])

  const regionElements = React.useMemo(() => computeSetElements(sets), [sets])

  const handleRegionClick = React.useCallback(
    (regionId: string) => {
      if (!interactive) return
      const newHighlights = highlights.includes(regionId)
        ? highlights.filter((h) => h !== regionId)
        : [...highlights, regionId]
      setInternalHighlights(newHighlights)
      onHighlightChange?.(newHighlights)
    },
    [interactive, highlights, onHighlightChange],
  )

  // Compute region center positions for element display
  const regionCenters: Array<{ id: string; x: number; y: number; elements: (string | number)[] }> =
    React.useMemo(() => {
      if (is3Set) {
        return [
          {
            id: "onlyA",
            x: circles[0].x - r * 0.35,
            y: circles[0].y,
            elements: regionElements.onlyA,
          },
          {
            id: "onlyB",
            x: circles[1].x + r * 0.35,
            y: circles[1].y,
            elements: regionElements.onlyB,
          },
          {
            id: "onlyC",
            x: circles[2].x,
            y: circles[2].y + r * 0.4,
            elements: regionElements.onlyC,
          },
          { id: "ab", x: cx, y: cy - r * 0.35, elements: regionElements.ab },
          { id: "ac", x: cx - r * 0.3, y: cy + r * 0.15, elements: regionElements.ac },
          { id: "bc", x: cx + r * 0.3, y: cy + r * 0.15, elements: regionElements.bc },
          { id: "abc", x: cx, y: cy, elements: regionElements.abc },
        ]
      }
      return [
        { id: "onlyA", x: circles[0].x - r * 0.3, y: cy, elements: regionElements.onlyA },
        { id: "onlyB", x: circles[1].x + r * 0.3, y: cy, elements: regionElements.onlyB },
        { id: "ab", x: cx, y: cy, elements: regionElements.ab },
      ]
    }, [circles, cx, cy, r, is3Set, regionElements])

  return (
    <div className="MafsView mafs-venn" style={{ width, height }}>
      <svg width={width} height={height}>
        {/* Circle fills */}
        {circles.map((circle, i) => (
          <circle
            key={`fill-${i}`}
            cx={circle.x}
            cy={circle.y}
            r={r}
            fill={circle.color}
            fillOpacity={0.1}
            stroke={circle.color}
            strokeWidth={2}
            style={{ transition: "fill-opacity 0.3s ease" }}
          />
        ))}

        {/* Highlighted regions (using clip-path intersections) */}
        <defs>
          {circles.map((circle, i) => (
            <clipPath key={`clip-${i}`} id={`mafs-venn-clip-${i}`}>
              <circle cx={circle.x} cy={circle.y} r={r} />
            </clipPath>
          ))}
        </defs>

        {/* Intersection highlight for 2-set */}
        {!is3Set && isHighlighted("ab", highlights, sets) && (
          <circle
            cx={circles[1].x}
            cy={circles[1].y}
            r={r}
            clipPath="url(#mafs-venn-clip-0)"
            fill={Theme.indigo}
            fillOpacity={0.3}
            style={{ transition: "fill-opacity 0.3s ease" }}
          />
        )}

        {/* Set labels */}
        {sets.map((set, i) => (
          <text
            key={`label-${i}`}
            x={circles[i].x + (i === 0 ? -r * 0.7 : i === 1 ? r * 0.7 : 0)}
            y={circles[i].y + (is3Set && i === 2 ? r + 16 : -r - 8)}
            textAnchor="middle"
            fontSize={14}
            fontWeight="bold"
            fill={circles[i].color}
          >
            {set.label}
          </text>
        ))}

        {/* Element text in regions */}
        {showElements &&
          regionCenters.map((region) => {
            if (region.elements.length === 0) return null
            const highlighted = isHighlighted(region.id, highlights, sets)
            return (
              <g
                key={region.id}
                onClick={() => handleRegionClick(region.id)}
                style={{ cursor: interactive ? "pointer" : "default" }}
              >
                {interactive && <circle cx={region.x} cy={region.y} r={20} fill="transparent" />}
                <text
                  x={region.x}
                  y={region.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fill="var(--mafs-fg)"
                  fontWeight={highlighted ? "bold" : "normal"}
                  opacity={highlighted ? 1 : 0.7}
                  style={{ transition: "opacity 0.3s ease" }}
                >
                  {region.elements.join(", ")}
                </text>
              </g>
            )
          })}

        {/* Region element counts */}
        {regionCenters.map((region) => {
          if (region.elements.length === 0) return null
          return (
            <text
              key={`count-${region.id}`}
              x={region.x}
              y={region.y + 14}
              textAnchor="middle"
              fontSize={9}
              fill="var(--mafs-fg)"
              opacity={0.5}
            >
              ({region.elements.length})
            </text>
          )
        })}
      </svg>
    </div>
  )
}

VennDiagram.displayName = "VennDiagram"
