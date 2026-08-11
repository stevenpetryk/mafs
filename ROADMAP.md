# Mafs modernization roadmap

This roadmap separates the work included in the current submission from future
ideas that still need scope, design, and maintainer review.

## Phase 1 — today's submission · 2026-08-11 · complete

This submission contains the fixes and integration work completed in this
checkout:

- Audited the historical GitHub issues and discussions in
  [`ISSUE-COVERAGE.md`](./ISSUE-COVERAGE.md) and [`UPSTREAM-AUDIT.md`](./UPSTREAM-AUDIT.md).
- Modernized camera, coordinate, pointer, keyboard, panning, zooming, and
  movable-point behavior while preserving the existing Mafs API.
- Added bounded panning, correct screen-to-math coordinate mapping, axis-arrow
  placement, transformed plot support, discontinuity handling, themes, local
  font assets, and custom SVG interaction support.
- Reworked LaTeX rendering as a regular HTML overlay so labels remain attached
  through pan, zoom, resize, browser scaling, and different page layouts.
- Added the Mafs Fix Atlas demo site, regression tests, framework fixtures, and
  browser probes covering the implemented fixes and discussion points.
- Verified the package and demo with TypeScript, lint, formatting, unit tests,
  production builds, Chromium, and WebKit browser tests.

## Phase 2 — future renderer and feature exploration · TBD

The following items are intentionally uncommitted future work. Scope, design,
ownership, and timing are all TBD:

- TBD — investigate a WebGL/WebGPU renderer for large plots and vector fields.
- TBD — evaluate a 3D plotting or 3D scene API without destabilizing the 2D
  Mafs surface.
- TBD — design a bounded implicit-function plotting API.
- TBD — review additional upstream issue and discussion feedback after the
  current submission.
- TBD — investigate host-specific rendering and integration reports where a
  library-level fix is technically appropriate.

No future roadmap item should be read as implemented or scheduled until it has
an agreed design and a separate validation plan.
