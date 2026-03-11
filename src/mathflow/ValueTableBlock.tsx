import * as React from "react"
import type { ValueTableConfig } from "./types"
import { compileWithParams } from "./ExpressionParser"

interface ValueTableBlockProps {
  config: ValueTableConfig
  params: Record<string, number>
}

/**
 * Renders a function evaluation table.
 * Computes function values at specified x positions and highlights
 * rows where function values are equal (intersections).
 */
export function ValueTableBlock({ config, params }: ValueTableBlockProps) {
  const { functions, xValues, highlightIntersections } = config

  // Compile functions
  const compiledFns = React.useMemo(
    () =>
      functions.map((fn) => ({
        label: fn.label,
        evaluate: compileWithParams(fn.expression, params),
      })),
    [functions, params],
  )

  // Compute values
  const rows = React.useMemo(
    () =>
      xValues.map((x) => ({
        x,
        values: compiledFns.map((fn) => fn.evaluate(x)),
      })),
    [xValues, compiledFns],
  )

  // Check for intersections
  const intersectionRows = React.useMemo(() => {
    if (!highlightIntersections || functions.length < 2) return new Set<number>()
    const result = new Set<number>()
    rows.forEach((row, i) => {
      for (let a = 0; a < row.values.length; a++) {
        for (let b = a + 1; b < row.values.length; b++) {
          if (Math.abs(row.values[a] - row.values[b]) < 0.001) {
            result.add(i)
          }
        }
      }
    })
    return result
  }, [rows, highlightIntersections, functions.length])

  return (
    <div className="MafsView mafs-value-table">
      <table className="mafs-value-table-grid">
        <thead>
          <tr>
            <th className="mafs-value-table-header">x</th>
            {compiledFns.map((fn, i) => (
              <th key={i} className="mafs-value-table-header">
                {fn.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`mafs-value-table-row ${intersectionRows.has(i) ? "mafs-value-table-row-highlight" : ""}`}
            >
              <td className="mafs-value-table-cell">{row.x}</td>
              {row.values.map((v, j) => (
                <td key={j} className="mafs-value-table-cell">
                  {isNaN(v) ? "—" : Number.isInteger(v) ? v : v.toFixed(3)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
