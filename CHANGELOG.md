# Changelog

# 0.11.2

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
