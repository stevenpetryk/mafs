# Upstream comparison and issue audit

Audit date: 2026-08-11

Repository: [stevenpetryk/mafs](https://github.com/stevenpetryk/mafs)

The local checkout is based on the same commit as GitHub `main`:
`e74a3ef465f4ddc98704814d2ae18b73a6cd9dae` (`Upgrade dependencies`). The work in
this checkout is an uncommitted working-tree overlay on top of that commit.

## Source comparison

Counts below cover TypeScript, JavaScript, and CSS in `src/` and `scripts/`.

| Tree                             | Files | Lines |
| -------------------------------- | ----: | ----: |
| GitHub `main`                    |    58 | 3,549 |
| Current library source           |    66 | 4,503 |
| Added local demonstration source |    24 | 1,952 |

The tracked working-tree overlay changes 60 files with 5,201 additions and 3,481
deletions. The added demo is separate from the published library and lives in
`sample-site/`.

## Issue disposition

The full historical mapping is in [ISSUE-COVERAGE.md](./ISSUE-COVERAGE.md). The
following distinctions are important when comparing it with the current GitHub
tracker:

- Actionable items that are implemented locally include themes and theme docs
  (#1, #12), accessibility guidance (#13), transformed plots and custom context
  support (#63, #35), Bézier paths (#76), bundled fonts (#89), initial and setter
  constraint application (#99), bounded panning (#115), axis arrows (#119),
  custom SVG interaction hooks (#117, #120), movable-point click handling
  (#125), and discontinuity exclusions (#133).
- Browser or host-specific reports remain documented rather than receiving an
  unsafe library workaround: iOS Safari grid artifacts (#104), Observable's
  JSX/UMD integration question (#111), and Firefox's rendering artifact (#175).
  The package does ship dual ESM/CJS output and integration fixtures, but it does
  not pretend that those external host problems are solved by unrelated code.
- Open-ended renderer proposals remain intentionally unimplemented: WebGL/WebGPU
  (#64), general implicit functions (#118 / Discussion #122), and 3D plots
  (Discussion #180). Mafs still exposes `useTransformContext`, `Plot.Parametric`,
  and custom SVG props for bounded integrations.

## Discussion disposition

The eight historical discussions are included in the coverage map and demo:

| Discussion | Result                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| #54        | Animation and a stable SVG-oriented API are represented by `useStopwatch` and the animation demo.                          |
| #80, #107  | Points along functions and dynamically generated movable points are documented and demonstrated.                           |
| #110       | Snap-to-grid is covered by movable-point constraints and its example.                                                      |
| #130       | Logarithmic plotting is covered by `Plot.OfX` with an explicit positive domain.                                            |
| #167       | Theme overrides, line styles, labels, and axis arrows are demonstrated.                                                    |
| #122, #180 | Reviewed as open-ended implicit-function and 3D-renderer proposals; no bounded API or safe implementation can be inferred. |

## LaTeX follow-up

Issue #4 is implemented with KaTeX. Labels are rendered as ordinary HTML in a
dedicated overlay outside the SVG, and their positions are derived from the SVG
screen transform. This avoids browser-specific `foreignObject` behavior while
keeping labels attached through camera pan/zoom, responsive layout changes, and
browser zoom. The demo uses `String.raw` to keep TeX backslashes unambiguous. The
browser probe checks initial placement, horizontal and vertical camera movement,
resize, and 200% zoom.
