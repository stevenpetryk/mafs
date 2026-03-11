import * as React from "react"

/** Props for the TruthTable component */
export interface TruthTableProps {
  /** Propositional variable names */
  variables: string[]
  /** Logical expressions to evaluate (using ∧, ∨, →, ¬, ↔) */
  expressions: string[]
  /** Row indices to highlight */
  highlightRows?: number[]
  /** Whether the user fills in values interactively (default: false) */
  interactive?: boolean
  /** Called when user submits answers in interactive mode */
  onSubmit?: (correct: boolean, score: number) => void
}

/** Evaluate a logical expression given variable assignments */
function evaluateLogical(expr: string, vars: Record<string, boolean>): boolean {
  // Tokenize and parse the expression
  let processed = expr

  // Replace variable names with their boolean values (longest first to avoid partial matches)
  const sortedVarNames = Object.keys(vars).sort((a, b) => b.length - a.length)
  for (const varName of sortedVarNames) {
    processed = processed.replace(new RegExp(`\\b${escapeRegex(varName)}\\b`, "g"), vars[varName] ? "T" : "F")
  }

  // Parse with recursive descent
  return parseExpression(processed.replace(/\s+/g, ""), 0).value
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

interface ParseResult {
  value: boolean
  pos: number
}

function parseExpression(s: string, pos: number): ParseResult {
  // Handle biconditional (lowest precedence)
  let result = parseImplication(s, pos)

  while (result.pos < s.length && s[result.pos] === "↔") {
    const right = parseImplication(s, result.pos + 1)
    result = { value: result.value === right.value, pos: right.pos }
  }

  return result
}

function parseImplication(s: string, pos: number): ParseResult {
  let result = parseDisjunction(s, pos)

  while (result.pos < s.length && s[result.pos] === "→") {
    const right = parseDisjunction(s, result.pos + 1)
    result = { value: !result.value || right.value, pos: right.pos }
  }

  return result
}

function parseDisjunction(s: string, pos: number): ParseResult {
  let result = parseConjunction(s, pos)

  while (result.pos < s.length && s[result.pos] === "∨") {
    const right = parseConjunction(s, result.pos + 1)
    result = { value: result.value || right.value, pos: right.pos }
  }

  return result
}

function parseConjunction(s: string, pos: number): ParseResult {
  let result = parseNegation(s, pos)

  while (result.pos < s.length && s[result.pos] === "∧") {
    const right = parseNegation(s, result.pos + 1)
    result = { value: result.value && right.value, pos: right.pos }
  }

  return result
}

function parseNegation(s: string, pos: number): ParseResult {
  if (pos < s.length && s[pos] === "¬") {
    const result = parseNegation(s, pos + 1)
    return { value: !result.value, pos: result.pos }
  }
  return parseAtom(s, pos)
}

function parseAtom(s: string, pos: number): ParseResult {
  if (pos >= s.length) return { value: false, pos }

  if (s[pos] === "(") {
    const result = parseExpression(s, pos + 1)
    // Skip closing paren
    const nextPos = result.pos < s.length && s[result.pos] === ")" ? result.pos + 1 : result.pos
    return { value: result.value, pos: nextPos }
  }

  if (s[pos] === "T") return { value: true, pos: pos + 1 }
  if (s[pos] === "F") return { value: false, pos: pos + 1 }

  // Unknown character, skip
  return { value: false, pos: pos + 1 }
}

/**
 * An auto-generated truth table for propositional logic.
 * Evaluates logical expressions with ∧ (and), ∨ (or), → (implies),
 * ¬ (not), and ↔ (biconditional).
 *
 * In interactive mode, cells start blank and users click to toggle T/F.
 */
export function TruthTable({
  variables,
  expressions,
  highlightRows,
  interactive = false,
  onSubmit,
}: TruthTableProps) {
  const numRows = Math.pow(2, variables.length)

  // Generate all variable assignments
  const rows = React.useMemo(() => {
    const result: Record<string, boolean>[][] = []
    for (let i = 0; i < numRows; i++) {
      const assignment: Record<string, boolean> = {}
      for (let j = 0; j < variables.length; j++) {
        assignment[variables[j]] = !!(i >> (variables.length - 1 - j) & 1)
      }
      result.push([assignment])
    }
    return result.map((r) => r[0])
  }, [variables, numRows])

  // Compute correct answers
  const correctAnswers = React.useMemo(() => {
    return rows.map((assignment) =>
      expressions.map((expr) => evaluateLogical(expr, assignment)),
    )
  }, [rows, expressions])

  // Interactive mode state: user's answers
  const [userAnswers, setUserAnswers] = React.useState<(boolean | null)[][]>(() =>
    rows.map(() => expressions.map(() => null)),
  )
  const [submitted, setSubmitted] = React.useState(false)

  const toggleCell = React.useCallback(
    (row: number, col: number) => {
      if (!interactive || submitted) return
      setUserAnswers((prev) => {
        const next = prev.map((r) => [...r])
        const current = next[row][col]
        next[row][col] = current === null ? true : current === true ? false : null
        return next
      })
    },
    [interactive, submitted],
  )

  const handleSubmit = React.useCallback(() => {
    setSubmitted(true)
    let correct = 0
    let total = 0
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < expressions.length; c++) {
        total++
        if (userAnswers[r][c] === correctAnswers[r][c]) correct++
      }
    }
    onSubmit?.(correct === total, correct / total)
  }, [rows, expressions, userAnswers, correctAnswers, onSubmit])

  return (
    <div className="MafsView mafs-truth-table">
      <table className="mafs-truth-table-grid">
        <thead>
          <tr>
            {variables.map((v) => (
              <th key={v} className="mafs-truth-table-var-header">
                {v}
              </th>
            ))}
            {expressions.map((expr, i) => (
              <th key={i} className="mafs-truth-table-expr-header">
                {expr}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((assignment, rowIdx) => {
            const isHighlighted = highlightRows?.includes(rowIdx)
            return (
              <tr
                key={rowIdx}
                className={`mafs-truth-table-row ${isHighlighted ? "mafs-truth-table-row-highlight" : ""}`}
              >
                {variables.map((v) => (
                  <td key={v} className="mafs-truth-table-cell mafs-truth-table-var-cell">
                    {assignment[v] ? "T" : "F"}
                  </td>
                ))}
                {expressions.map((_, colIdx) => {
                  const correctVal = correctAnswers[rowIdx][colIdx]
                  const userVal = userAnswers[rowIdx][colIdx]

                  if (interactive) {
                    const showCorrect = submitted && userVal !== correctVal
                    return (
                      <td
                        key={colIdx}
                        className={`mafs-truth-table-cell mafs-truth-table-interactive-cell ${
                          submitted
                            ? userVal === correctVal
                              ? "mafs-truth-table-correct"
                              : "mafs-truth-table-incorrect"
                            : ""
                        }`}
                        onClick={() => toggleCell(rowIdx, colIdx)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") toggleCell(rowIdx, colIdx)
                        }}
                        aria-label={`Row ${rowIdx + 1}, ${expressions[colIdx]}: ${userVal === null ? "empty" : userVal ? "true" : "false"}`}
                      >
                        {userVal === null ? "—" : userVal ? "T" : "F"}
                        {showCorrect && (
                          <span className="mafs-truth-table-correction">
                            {correctVal ? "T" : "F"}
                          </span>
                        )}
                      </td>
                    )
                  }

                  return (
                    <td key={colIdx} className="mafs-truth-table-cell mafs-truth-table-expr-cell">
                      {correctVal ? "T" : "F"}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      {interactive && !submitted && (
        <button className="mafs-truth-table-submit" onClick={handleSubmit}>
          Check Answers
        </button>
      )}
    </div>
  )
}

TruthTable.displayName = "TruthTable"
