# Historical issue and discussion coverage

This checklist records the review of the exported archive
mafs-issues-and-discussions.md. Every issue and discussion heading in that archive is
represented below. “Implemented” means the behavior is in the source, tests, or public
documentation. “Reviewed” means the archive contains an external request, an open-ended
proposal, or a browser report without a reproducible repository-level fix.

The upstream comparison, current GitHub status distinction, and exact source line
counts are recorded in [UPSTREAM-AUDIT.md](./UPSTREAM-AUDIT.md).

## Implemented

| Archive item                                                | Coverage                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Issues #1, #12                                              | Theme and CSS custom properties are centralized, and the Mafs guide documents palette variables and overrides.                                                                                                                                                 |
| Issues #2, #3, #4, #6, #22, #25, #48                        | Horizontal/vertical line helpers, Plot.OfY, LaTeX, polar coordinates, vec exports, the MIT license, and CSS subpath exports are available.                                                                                                                     |
| Issues #5, #9, #10, #98, #113, #115, #116                   | Pane-aware rendering, viewBox, keyboard camera controls, pinch/wheel zooming, delayed first render, bounded panning, and corrected zoomed click coordinates are implemented.                                                                                   |
| Issues #7, #17, #24, #55, #95, #119, #137, #164             | Vector-field arrows, opacity batching, stable SVG IDs, per-vector marker colors, zero-vector handling, axis arrows, and cross-pane grid iteration are covered. Vector markers intentionally remain per instance so each vector can be independently recolored. |
| Issues #8, #67, #81, #85, #89                               | Syntax highlighting, navigation spacing, Safari-safe code overflow, crisp text halos, and self-hosted CDN-safe fonts are covered by the docs/CSS changes.                                                                                                      |
| Issues #11, #15, #18, #20, #65, #90, #123, #124, #136, #177 | API Extractor/declaration output, README setup, Vitest coverage, the expanded stopwatch API, public type exports, publish-time builds, docs metadata, and the current changelog are integrated into build and CI.                                              |
| Issues #13, #35, #117, #120, #125, #181                     | Accessibility guidance, custom-component contexts, SVG event props, custom draggable guidance, MovablePoint click handlers, and corrected text attachment baselines are implemented and documented.                                                            |
| Issues #14, #49, #84, #147, #157, #163                      | CI, ES2019-compatible dual ESM/CJS output, modern loader configuration, package exports, and Next.js/Vite/sample integration fixtures are included.                                                                                                            |
| Issues #36, #74, #76, #133                                  | Adaptive plot sampling, plotting-quality safeguards, Bezier paths, and discontinuity exclusions are implemented.                                                                                                                                               |
| Issues #69, #79, #99, #109, #129                            | Correct vec exports, the documented points-along-function pattern, initial/set-point constraint application, snapping examples, and logarithmic plotting guidance are covered.                                                                                 |

## Implemented with documented limits

| Archive item                                 | Coverage                                                                                                                                                                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Issue #63                                    | Plot, inequality, and vector-field transforms now include user transforms. Cartesian grids remain viewport-relative, and Text intentionally transforms its anchor only to preserve readable labels; both limits are documented in the Transform guide. |
| Discussions #54, #80, #107, #110, #130, #167 | Animation controls, points along functions, dynamic movable points, snap-to-grid, logarithmic plots, themes, line styles, and axis arrows are represented in the public guides and examples.                                                           |

## Reviewed with no additional core change required

| Archive item            | Disposition                                                                                                                                                                                                                                                                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Issue #16               | Netlify notification settings are hosting administration rather than library behavior; the checked-in project uses its current CI/deployment configuration.                                                                                                                                                                                    |
| Issues #64, #118, #132  | First-class WebGL/three.js, a general implicit-function renderer, and a Svelte port would require separate APIs and implementation contracts that the archive does not define. Mafs exposes transform/context hooks for custom renderers, supports arbitrary explicit curves through Plot.Parametric, and remains intentionally React-focused. |
| Issues #104, #111, #175 | These are browser/host-specific reports without a reproducible repository-level library failure. Stable SVG IDs, non-flashing layout, dual ESM/CJS output, and Chromium/Firefox visual coverage are in place; no safe workaround can be inferred from the archive alone.                                                                       |
| Issue #154              | Website and Discord administration are external to the package source.                                                                                                                                                                                                                                                                         |
| Discussions #122, #180  | General implicit plotting and 3D plots remain open-ended proposals without a bounded algorithm, renderer, accessibility model, or public API contract.                                                                                                                                                                                         |

Validation commands are listed in the root README and run in CI.
