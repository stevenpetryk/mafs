# Changelog

## 0.22.0

### Performance

- `Plot.Parametric`, `Plot.OfX`, and `Plot.OfY` now accumulate SVG path strings in
  an array and join them once, instead of repeatedly concatenating strings, which
  is significantly faster for dense plots.
- `Plot.VectorField` now renders all vectors for a given opacity into a single
  `<path>` layer instead of one `<path>` per vector, drastically reducing the
  number of DOM nodes and improving framerate on dense fields ([#55](https://github.com/stevenpetryk/mafs/issues/55)).
- `VectorField` grid iteration now uses integer indices with a half-open range so
  adjacent panes never draw the same vector twice, avoiding duplicate arrows along
  pane boundaries.
- Mafs now ships dual `import`/`require` builds (ESM + CJS) via esbuild ([#49](https://github.com/stevenpetryk/mafs/issues/49)).
- The `vec` module uses 2x3 matrices, avoiding the wasted third column ([#92](https://github.com/stevenpetryk/mafs/pull/92)).

### Plot quality

- Plots now support an `exclusions` prop so discontinuous functions are rendered
  with a gap instead of a misleading vertical line ([#133](https://github.com/stevenpetryk/mafs/issues/133)).
- Non-finite samples no longer connect neighboring points across discontinuities.
- `Plot.OfX` and `Plot.OfY` respect the `domain` prop in addition to the visible
  pane range.

### Bug fixes

- `Text` with `attach="n"`/`"s"` now renders above/below correctly by using the
  `auto` and `hanging` dominant baselines, instead of swapping the two ([#181](https://github.com/stevenpetryk/mafs/issues/181)).
- Text no longer uses a text-shadow that makes colored text look fuzzy; it now
  paints a background-colored halo via `paint-order: stroke` instead ([#85](https://github.com/stevenpetryk/mafs/issues/85)).
- `MovablePoint` constraints are now applied when the point is initialized, not
  only while dragging ([#99](https://github.com/stevenpetryk/mafs/issues/99)).
- Panning can now be limited via the `pan={{ x: [min, max], y: [min, max] }}`
  bounds ([#115](https://github.com/stevenpetryk/mafs/issues/115)).
- The `onClick` handler reports the correct y-coordinate when the view is zoomed
  ([#116](https://github.com/stevenpetryk/mafs/issues/116)).
- Mafs no longer flashes a 1px-wide canvas on its initial render; it waits until
  the container width is known ([#113](https://github.com/stevenpetryk/mafs/issues/113)).
- `Vector` arrows render correctly in iOS Safari and no longer conflict across
  instances ([#95](https://github.com/stevenpetryk/mafs/issues/95)).
- `Coordinates.Cartesian` no longer re-renders constantly due to a changing ID
  ([#159](https://github.com/stevenpetryk/mafs/pull/159)).
- All exported components have stable `displayName`s for clearer React DevTools
  output ([#11](https://github.com/stevenpetryk/mafs/issues/11)).
- TypeScript declarations are merged into a single `build/index.d.ts` with a
  consistent public API surface ([#15](https://github.com/stevenpetryk/mafs/issues/15),
  [#90](https://github.com/stevenpetryk/mafs/issues/90)).

### Tooling and modernizations

- The project now builds and typechecks with TypeScript 6, and is verified
  against the native TypeScript 7 compiler.
- Unit tests have been migrated from Jest to Vitest, running in ~1 second.
- Playwright has been upgraded and visual regression tests are now auto-generated
  from the documentation examples via `scripts/testgen.ts`.
- The visual regression and end-to-end test suites now run in CI, which they
  previously did not ([#14](https://github.com/stevenpetryk/mafs/issues/14)).
- Added framework smoke tests that verify Mafs renders correctly in Vite and
  Next.js projects ([#111](https://github.com/stevenpetryk/mafs/issues/111),
  [#147](https://github.com/stevenpetryk/mafs/issues/147),
  [#163](https://github.com/stevenpetryk/mafs/issues/163)).
- The documentation site build is pinned to a single set of React type
  definitions, resolving a `ReactNode` mismatch that broke `next build`.

## 0.21.0

- Adds an `Image` component for embedding images in your visualizations. ([#174](https://github.com/stevenpetryk/mafs/pull/174)).
- Adds a `debug` prop to `Mafs` to make it easy to peek outside the current camera's view for debugging lazy-loaded visualizations.

## 0.20.1

- Fixes 'overhandling' of arrow keypresses ([#169](https://github.com/stevenpetryk/mafs/pull/169))

## 0.20.0

- Use package entrypoints, correctly tag this package as ESM using "type": "module" ([#170](https://github.com/stevenpetryk/mafs/pull/170/)).

## 0.19.0

- All plots (OfX, OfY, and Parametric) now support a `domain` prop. Previously, only the `Parametric` component supported setting a domain, and the prop to do so was called `t`, but this prop has been deprecated in favor of the new `domain` prop across all three plot components. Eventually, `t` will be removed.

## 0.18.8

- VectorField no longer breaks when rendering the vector `[0, 0]` ([#164](https://github.com/stevenpetryk/mafs/issues/164)).

## 0.18.7

- Mafs no longer declares a dependency on Node 20.11, instead depending on Node 20. In the future, the published version of Mafs will not declare an `engines` field at all, since Mafs is, of course, just a frontend project.

## 0.18.6

- The stroke width of axes on `Coordinates.Cartesian` have now been parameterized via the `--mafs-axis-stroke-width` CSS custom property. ([#160](https://github.com/stevenpetryk/mafs/pull/160))
- A bug that caused `Coordinates.Cartesian` to re-render frequently due to a changing ID has been fixed ([#159](https://github.com/stevenpetryk/mafs/pull/159)).

## 0.18.5

- The appearance of dashed lines has been unified across various components, and is now accessible via `var(----mafs-line-stroke-dash-style)`. Thanks [@jeremywiebe](https://github.com/jeremywiebe)! [#153](https://github.com/stevenpetryk/mafs/pull/153).

## 0.18.4

- This version is published without `"type": "module"` in package.json to improve compatibility with some environments.

## 0.18.3

- As of [#144](https://github.com/stevenpetryk/mafs/pull/144), there is a new hook, `useMovable`, that has been extracted out of `useMovablePoint`, and will eventually be used for being able to move various Mafs elements.

## 0.18.2

- Vectors are no longer always red. This was a silly mistake introduced in v0.18.1 as I was trying to test that alternate Vector colors work. Mafs has automated visual regression tests, but they don't run in CI, and I believe they should.

## 0.18.1

- Vectors no longer render a white outline, allowing them to be recolored correctly (see [#137](https://github.com/stevenpetryk/mafs/issues/137)).

## 0.18.0

- In [#135](https://github.com/stevenpetryk/mafs/pull/135), the adaptive plotter was improved to more accurately plot highly periodic functions, and also to avoid plotting duplicate points. This should give a quality boost to most plots, but may slightly alter some. The sampling depth parameters are now "one lower", meaning that if you were previously passing `maxSamplingDepth={15}`, for example, you should now pass `maxSamplingDepth={16}`. Change is annoying, but the depth made no sense before, and now it does (a depth of 16 means 2¹⁶ subdivisions).

## 0.17.0

- Introduces the [LaTeX](https://mafs.dev/guides/experimental/latex) component.
- Deprecates the `ssr` attribute in favor of never rendering Mafs until hydration.

## 0.16.0

- Mafs now supports rendering a `Polyline` (previously it only supported `Polygon`). Thanks [@Mesoptier](https://github.com/Mesoptier)!
- Mafs now has `Plot.Inequality` for rendering the area greater than, less than, or between two functions.

## 0.15.2

- The `<Mafs />` component now has an `onClick` prop.

## 0.15.1

- Fixes a regression introduced in v0.15.1 where the axis labels had a white fill regardless of the `--mafs-origin-color` custom property.

## 0.15.0

- Mafs now supports zooming! It's opt-in, and can be enabled by setting the `zoom` prop on `Mafs`. See the [Mafs docs](https://mafs.dev/guides/display/mafs) for more information.

## 0.14.0

- `CartesianCoordinates` is now `Coordinates.Cartesian`. In addition to Cartesian coordinates, you
  can now also use `Coordinates.Polar` to display polar coordinates. See the [Coordinates docs](https://mafs.dev/guides/display/coordinates) for more information.

## 0.13.1

- Fixes an issue ([#95](https://github.com/stevenpetryk/mafs/issues/95)) where arrow markers in `Vector` were transformed incorrectly and looked comically large.

## 0.13.0

- `vec.Matrix` is now a 2x3 matrix instead of a 3x3 matrix. This is a potentially breaking change from a TypeScript perspective, but shouldn't have any real impact on behavior—other than making things faster! Thank you to @sritchie for identifying this opportunity and [improving a lot of the code in `vec`](https://github.com/stevenpetryk/mafs/pull/92).

## 0.12.0

- Mafs has had a mostly-internal update to correct the TypeScript types that were being exported. This is unlikely to affect existing code, unless you were importing `Vector2` or `Matrix` from Mafs. The correct way to import those types is now `import { vec } from 'mafs'` and then use `vec.Vector2` and `vec.Matrix`.

## 0.11.4

- All exported Mafs components now have `displayName`, making the React devtools a little easier to read.

## 0.11.3

- Introduces a new debug component, `Debug.ViewportInfo`.

## 0.11.2

- Fixes a subtle bug introduced in v0.11.1 involving Safari treating empty CSS elements the same as undefined ones.

## 0.11.1

- Fixes a tiny bug where `--mafs-user-transform` was not defined by `Mafs`, causing CSS to treat some transform strings as invalid.

## 0.11.0

- Mafs now exposes a bit of its internals to allow you to use your own custom components. See the documentation on [Custom Components](https://mafs.dev/guides/custom-components/overview) for more information.

## 0.10.1

- Fixes a bug where `Text` would have an ugly stroke when a custom color is set ([#85](https://github.com/stevenpetryk/mafs/issues/85)).

## 0.10.0

### Breaking changes

- `VectorField` is now `Plot.VectorField`
- `FunctionGraph` is now `Plot`
- Several props from these components have changed. See the [documentation on Plots](https://mafs.dev/guides/display/plots) for the latest guidance.

### Improvements

- Mafs' numerical function sampling algorithm has been improved.
- There is now a `Plot.OfY`. Both `Plot.OfX` and `Plot.OfY` use `Plot.Parametric` under the hood.

## 0.9.0

- Mafs now ships with the Computer Modern typeface, and makes it easy to use in your own project. It just requires a change to your CSS:

  ```diff
  -@import "mafs/build/index.css";
  +@import "mafs/core.css";
  +@import "mafs/font.css"; /* optional */
  ```

  `"mafs/build/index.css"` is still included in the package to avoid breaking things. It will be removed in a future release.

## 0.8.2

- Ensures that `React.PropsWithChildren` is used for components that accept children, for React 18 compatibility reasons.

## 0.8.1

- Fixes a bug involving the ESM build.

## 0.8.0

- Added the [`Transform` component](https://mafs.dev/guides/utility/transform)
- Added the [`viewBox` prop](https://mafs.dev/guides/display/viewbox)

### Breaking changes

- `xAxisExtent` and `yAxisExtent` have been replaced with [`viewBox`](https://mafs.dev/guides/display/viewbox).

## 0.7.2

- When `pan` is enabled on a `Mafs` view, keyboard users can now focus on the view itself and use the arrow keys to pan.

## 0.7.1

- `MovablePoint` will no longer get stuck in its dragging state.

## 0.7.0

- `vec` is now exposed as an export from `mafs`, inlining the previously separate `vec-la` package and making it type-safe.

## 0.6.1

- Fixes a bug where cartesian coordinate lines would flicker due to some floating point rounding errors.

## 0.6.0

- `MovablePoint` can now be used directly, no longer is it hidden behind `useMovablePoint`. See the [Movable Points docs](https://mafs.dev/guides/interaction/movable-points/).
- `useMovablePoint` now returns a `setPoint` function which allows you to set the point's position imperatively.

## 0.5.1

- Bundle is now transpiled to browserslist's `defaults` for compatibility.

## 0.5.0

### Features

- Smooth interpolation for parametric functions: the parametric function sampling algorithm now dynamically increases the number of samples depending on the roughness of a function. See [PR #37](https://github.com/stevenpetryk/mafs/pull/37).

## 0.4.4

### Bug fixes

- Fixes an issue where, given certain `constrain` functions in `useMovablePoint`, using the keyboard to move points didn't work (see PR #23). Also, keyboard movement was generally broken in certain cases.

## 0.4.3

### Bug fixes

- Axis labels looked odd in Firefox—they were misaligned. Internally, switching from `alignmentBaseline` to `dominantBaseline` fixed this.

## 0.4.2

### Bug fixes

- Not really a "bug", but Mafs incorrectly declared too strict of a dependency on React 16.8, causing a peerdependency warning when using React 17.

### Improvements

- Mafs no longer has a runtime dependency on gl-matrix-invert, gl-mat2, gl-mat3, or gl-mat4.

## 0.4.1

### Bug fixes

- The TypeScript types for `VectorField` no longer (erroneously) require the `xyOpacity` and `opacityStep` props.

## 0.4.0

### New features

- Added [`Line.Segment`](https://mafs.dev/guides/display/lines/)
- Added [Bezier curve example](https://mafs.dev/guides/examples/bezier-curves/)

### Bug fixes

- `FunctionGraph.Parametric` now supports decreasing values of `t`, enabling functions to be evaluated "backwards".

### Changes

- Dashed lines are now dashier (the dash array was changed from `4,3` to `1,10`).

## 0.3.2

- Re-released as bundled by esbuild. Slightly smaller bundle with minified CSS. No behavioral changes.

## 0.3.1

- Re-released under MIT license. No code changes.

## 0.3.0

Improved the build process to roll up TypeScript types using api-extractor. No
changes have been made to any APIs, but the exported types should more closely
match what is actually exported.
