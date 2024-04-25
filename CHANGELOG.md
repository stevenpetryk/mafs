# Changelog

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
