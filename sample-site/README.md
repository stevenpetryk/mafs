# Mafs Fix Atlas

A small, responsive showcase for the Mafs polish pass. It renders live examples
from the repository's local src/ through a Vite alias, so the demos exercise
the same code that the package builds and tests.

The page covers:

- themes, line primitives, OfY, polar coordinates, fonts, and CSS packaging
- adaptive plotting, logarithmic functions, Bezier curves, and discontinuities
- vector-field arrows, opacity batching, stable IDs, and axis arrows
- keyboard-ready movable points, snapping, constraints, clicks, and transforms
- bounded camera movement, zoomed coordinate clicks, animation controls, and LaTeX
- custom transform contexts plus a coverage board for API, CI, docs, and package fixes

The final coverage board also calls out the historical proposals that were
reviewed but intentionally remain separate product work: WebGL, general
implicit-function rendering, Svelte, and 3D plots.

## Run locally

From this directory:

```bash
pnpm install
pnpm dev
```

Then open http://localhost:5173.

To verify the production bundle:

```bash
pnpm build
```
