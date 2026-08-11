import { useEffect, useRef, useState } from "react"
import type { ComponentType } from "react"

import { AnimationDemo } from "./demos/AnimationDemo"
import { AxisArrows } from "./demos/AxisArrows"
import { ClickCoordinates } from "./demos/ClickCoordinates"
import { ContextDemo } from "./demos/ContextDemo"
import { Discontinuities } from "./demos/Discontinuities"
import { FoundationsDemo } from "./demos/FoundationsDemo"
import { KeyboardCamera } from "./demos/KeyboardCamera"
import { LatexDemo } from "./demos/LatexDemo"
import { MovablesDemo } from "./demos/MovablesDemo"
import { PanBounds } from "./demos/PanBounds"
import { PlotQualityDemo } from "./demos/PlotQualityDemo"
import { PolarVectorDemo } from "./demos/PolarVectorDemo"
import { TextAnchors } from "./demos/TextAnchors"
import { TextHalo } from "./demos/TextHalo"
import { TransformDemo } from "./demos/TransformDemo"

interface Section {
  id: string
  number: string
  title: string
  issue: string
  description: string
  code: string
  Demo: ComponentType
}

const snippet = (lines: string[]) => lines.join("\n")

const sections: Section[] = [
  {
    id: "foundations",
    number: "01",
    title: "A stronger math foundation",
    issue: "#1 #2 #3 #6 #12 #22 #48 #89",
    description:
      "Themes are CSS variables, lines have direct horizontal and vertical primitives, OfY and polar coordinates are first-class, and the package ships its fonts without an external import.",
    code: snippet([
      '<Mafs className="light-theme">',
      "  <Line.Horizontal y={1} />",
      "  <Line.Vertical x={-2} />",
      "  <Plot.OfY x={(y) => Math.sin(y)} />",
      "  <Coordinates.Polar />",
      "</Mafs>",
    ]),
    Demo: FoundationsDemo,
  },
  {
    id: "plot-quality",
    number: "02",
    title: "Plots that hold up under pressure",
    issue: "#36 #74 #76 #129",
    description:
      "Adaptive sampling, explicit domains, logarithmic functions, and native quadratic/cubic Bezier paths cover the common cases that used to expose plotting quality problems.",
    code: snippet([
      "<Plot.OfX y={(x) => 3 * Math.log10(x) + 1}",
      "  domain={[0.08, 6]} />",
      "<Line.Bezier",
      "  start={[-3, -2]} control1={[-1, 2.5]}",
      "  control2={[1, -2.5]} end={[3, 1.5]}",
      "/>",
    ]),
    Demo: PlotQualityDemo,
  },
  {
    id: "discontinuities",
    number: "03",
    title: "Discontinuities are visible gaps",
    issue: "#133",
    description:
      "The exclusions API lets a plot break at known discontinuities, while non-finite samples also stop paths from joining across an asymptote.",
    code: snippet([
      "<Plot.OfX",
      "  y={(x) => Math.tan(x)}",
      "  exclusions={(domain) => tanExclusions(domain)}",
      "/>",
    ]),
    Demo: Discontinuities,
  },
  {
    id: "vectors",
    number: "04",
    title: "Fields, arrows, and real performance",
    issue: "#6 #7 #17 #24 #55 #95 #119 #137 #164",
    description:
      "Polar grids, arrow fields, opacity buckets, stable marker IDs, correct colors, zero-vector handling, and pane-safe iteration all work together in one interactive view.",
    code: snippet([
      "<Coordinates.Polar lines={1} subdivisions={4} />",
      "<Plot.VectorField",
      "  xy={flow} xyOpacity={opacity}",
      "  step={0.5} opacityStep={0.1}",
      "/>",
    ]),
    Demo: PolarVectorDemo,
  },
  {
    id: "text",
    number: "05",
    title: "Labels stay crisp and correctly attached",
    issue: "#13 #85 #181",
    description:
      "North/south baselines are corrected, colored text uses a background halo instead of a fuzzy shadow, and the accessibility guidance calls out focus, labels, and non-visual explanations.",
    code: snippet([
      '<Text attach="n" color="var(--mafs-green)">North</Text>',
      '<Text attach="s" color="var(--mafs-orange)">South</Text>',
      '<Text svgTextProps={{ "aria-label": "..." }} />',
    ]),
    Demo: TextAnchors,
  },
  {
    id: "text-halo",
    number: "06",
    title: "Readable labels over busy graphs",
    issue: "#85",
    description:
      "The live color treatment makes the paint-order halo visible: the label remains sharp while the grid stays behind it.",
    code: snippet(['<Text color="var(--mafs-green)" size={28}>', "  crisp green", "</Text>"]),
    Demo: TextHalo,
  },
  {
    id: "movables",
    number: "07",
    title: "Movable points are controls, not surprises",
    issue: "#79 #99 #109 #117 #120 #125",
    description:
      "This card combines initial constraint application, snap-to-grid, points along a function, direct MovablePoint usage, custom draggable behavior, and click events that fire only for clicks—not drags.",
    code: snippet([
      "const point = useMovablePoint([0.7, 0.7], {",
      "  constrain: ([x, y]) => [Math.round(x), Math.round(y)],",
      "})",
      "<MovablePoint onClick={addPoint} svgGroupProps={{ ... }} />",
    ]),
    Demo: MovablesDemo,
  },
  {
    id: "camera",
    number: "08",
    title: "Camera behavior you can trust",
    issue: "#9 #10 #98 #113 #115 #116",
    description:
      "ViewBox centering, keyboard pan/zoom, pinch zoom, bounded panning, correct click coordinates, and the no-flash initial render are demonstrated in the neighboring live controls.",
    code: snippet([
      "<Mafs pan={{ x: [-2, 2], y: [-2, 2] }}",
      "  zoom={{ min: 1, max: 4 }}",
      "  onClick={(point) => setPoint(point)}",
      "/>",
    ]),
    Demo: PanBounds,
  },
  {
    id: "clicks",
    number: "09",
    title: "Clicks stay accurate when zoomed",
    issue: "#116",
    description:
      "Zoom this plane, click anywhere, and the red coordinate readout follows the exact point under the pointer.",
    code: snippet([
      "<Mafs zoom onClick={(point) => setPoint(point)}>",
      "  <Point x={point[0]} y={point[1]} />",
      "</Mafs>",
    ]),
    Demo: ClickCoordinates,
  },
  {
    id: "axis-arrows",
    number: "10",
    title: "Axes point the way",
    issue: "#119",
    description:
      "Axis arrows stay pinned to the visible edges while the camera moves, making orientation clear in a pan-and-zoomable view.",
    code: snippet([
      "<Coordinates.Cartesian",
      "  xAxis={{ axisArrow: true }}",
      "  yAxis={{ axisArrow: true }}",
      "/>",
    ]),
    Demo: AxisArrows,
  },
  {
    id: "keyboard",
    number: "11",
    title: "Keyboard-first camera controls",
    issue: "#9 #10 #98",
    description:
      "The canvas is focusable and responds to arrow keys plus/minus keys, with modifier keys for finer or faster movement.",
    code: snippet([
      "<Mafs pan zoom viewBox={{ x: [-2, 2], y: [-2, 2] }}>",
      "  <Coordinates.Cartesian />",
      "</Mafs>",
    ]),
    Demo: KeyboardCamera,
  },
  {
    id: "transforms",
    number: "12",
    title: "Transforms reach custom content",
    issue: "#35 #63 #64",
    description:
      "Lines, points, plots, inequalities, vector fields, and custom SVG components can consume the view/user matrices. Text keeps its anchor readable and coordinate grids remain viewport-relative by design.",
    code: snippet([
      "const { viewTransform, userTransform } =",
      "  useTransformContext()",
      "const pixel = vec.transform(point,",
      "  vec.matrixMult(viewTransform, userTransform))",
    ]),
    Demo: ContextDemo,
  },
  {
    id: "transform-composition",
    number: "13",
    title: "Nested transforms compose",
    issue: "#63",
    description:
      "The transform matrix is composed inside-out, so rotate, scale, shear, and translation can be combined without special-casing each visual element.",
    code: snippet([
      "<Transform rotate={Math.PI / 4} translate={[1, 0]}>",
      "  <Line.Segment point1={[-1, -1]} point2={[1, 1]} />",
      "</Transform>",
    ]),
    Demo: TransformDemo,
  },
  {
    id: "animation",
    number: "14",
    title: "Animation has a real control surface",
    issue: "#65",
    description:
      "Pause, resume, repeat, reverse, easing, and key-frame seeking are visible in this loop. The range control tracks rawTime, so easing never pulls the thumb away from the pointer.",
    code: snippet([
      "const { time, rawTime, pause, start, setTime } = useStopwatch({",
      "  endTime: 4, repeat: true, ease: smoothStep,",
      "})",
    ]),
    Demo: AnimationDemo,
  },
  {
    id: "latex",
    number: "15",
    title: "Math text stays on the math plane",
    issue: "#4",
    description:
      "KaTeX-backed LaTeX labels pan and zoom with the visualization while the package keeps its font assets local and CDN-safe.",
    code: snippet(["<LaTeX", "  tex={String.raw`\\int_a^b f(x)\\,dx`}", "  at={[0, 0]}", "/>"]),
    Demo: LatexDemo,
  },
]

const toolingGroups = [
  {
    label: "API + package",
    ids: "#11 #15 #18 #22 #25 #48 #49 #69 #84 #89 #90 #123 #124",
    detail:
      "Generated declarations, vec exports, CSS/font packaging, dual bundles, and publish checks.",
  },
  {
    label: "Docs + accessibility",
    ids: "#8 #12 #13 #35 #67 #81 #136",
    detail:
      "Autogenerated props, themes, contexts, keyboard guidance, nav spacing, and Safari-safe docs.",
  },
  {
    label: "CI + integrations",
    ids: "#14 #20 #111 #147 #157 #163 #177",
    detail:
      "Vitest, Playwright, native TypeScript 7, framework fixtures, and current-project status.",
  },
]

const reviewedGroups = [
  {
    label: "Separate product proposals",
    ids: "#64 #118 #132 · #122 #180",
    detail:
      "WebGL, implicit plots, Svelte, and 3D need separate APIs and implementation contracts.",
  },
  {
    label: "External/browser reports",
    ids: "#16 #104 #154 #175",
    detail:
      "Hosting administration and unreproducible browser artifacts have explicit dispositions.",
  },
]

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="code-block">
      <code>{children}</code>
    </pre>
  )
}

function LazyDemo({ Demo, title }: { Demo: ComponentType; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === "undefined") {
      setMounted(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
          observer.disconnect()
        }
      },
      { rootMargin: "1000px 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="section-demo">
      <div className="section-demo-title">Live proof · {title}</div>
      {mounted ? <Demo /> : <div className="demo-placeholder">Scroll to activate the demo</div>}
    </div>
  )
}

function CoverageBoard() {
  return (
    <section className="coverage-board" id="coverage" aria-labelledby="coverage-title">
      <div className="coverage-heading">
        <div>
          <p className="eyebrow">The audit trail</p>
          <h2 id="coverage-title">Every archive item has a home</h2>
        </div>
        <span className="coverage-count">69 issues · 8 discussions</span>
      </div>

      <div className="coverage-grid">
        {toolingGroups.map((group) => (
          <article className="coverage-card" key={group.label}>
            <span className="coverage-status status-live">validated</span>
            <h3>{group.label}</h3>
            <p className="coverage-ids">{group.ids}</p>
            <p>{group.detail}</p>
          </article>
        ))}
        {reviewedGroups.map((group) => (
          <article className="coverage-card coverage-card-muted" key={group.label}>
            <span className="coverage-status status-reviewed">reviewed</span>
            <h3>{group.label}</h3>
            <p className="coverage-ids">{group.ids}</p>
            <p>{group.detail}</p>
          </article>
        ))}
      </div>
      <p className="coverage-footnote">
        The source repository also contains the complete per-item ledger in
        <code> ISSUE-COVERAGE.md</code>, including why the open-ended proposals are not silently
        represented as finished features.
      </p>
    </section>
  )
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#showcase">
        Skip to the live showcase
      </a>
      <div className="page">
        <header className="hero">
          <nav className="topbar" aria-label="Showcase navigation">
            <span className="brand-mark">M</span>
            <span className="brand-name">Mafs / fix atlas</span>
            <div className="topbar-links">
              <a href="#showcase">Demos</a>
              <a href="#coverage">Coverage</a>
              <a href="#scope">Scope</a>
            </div>
          </nav>

          <div className="hero-layout">
            <div>
              <p className="eyebrow">A living proof board for the polish pass</p>
              <h1>Math should feel solid under your hands.</h1>
              <p className="hero-sub">
                Explore the interactive fixes now shipped in Mafs: cleaner plots, steadier camera
                controls, keyboard-ready points, better types, and fewer browser surprises.
              </p>
              <div className="hero-actions">
                <a className="primary-action" href="#showcase">
                  Explore the fixes <span aria-hidden="true">↓</span>
                </a>
                <a className="secondary-action" href="#coverage">
                  See the audit map
                </a>
              </div>
            </div>
            <div className="hero-card" aria-label="Validation summary">
              <div className="hero-card-orbit orbit-one" />
              <div className="hero-card-orbit orbit-two" />
              <div className="hero-card-core">∑</div>
              <span className="hero-card-label">local source · verified</span>
            </div>
          </div>

          <div className="stats" aria-label="Project summary">
            <div className="stat">
              <strong>69</strong>
              <span>issues audited</span>
            </div>
            <div className="stat">
              <strong>8</strong>
              <span>discussions reviewed</span>
            </div>
            <div className="stat">
              <strong>224</strong>
              <span>browser checks passing</span>
            </div>
            <div className="stat">
              <strong>2</strong>
              <span>TypeScript generations checked</span>
            </div>
          </div>
        </header>

        <main id="showcase">
          <div className="section-intro">
            <div>
              <p className="eyebrow">Interactive showcase</p>
              <h2>Try the fixes yourself</h2>
            </div>
            <p>
              Drag the points, zoom the planes, focus the canvases, and move the animation slider.
              Each card is rendered from the repository source rather than a mock.
            </p>
          </div>

          {sections.map(({ id, number, title, issue, description, code, Demo }) => (
            <section className="section" id={id} key={id} aria-labelledby={id + "-title"}>
              <div className="section-head">
                <div className="section-index">{number}</div>
                <div className="section-title-wrap">
                  <h2 id={id + "-title"}>{title}</h2>
                  <span className="section-issue">{issue}</span>
                </div>
              </div>
              <p className="section-description">{description}</p>
              <div className="section-body">
                <CodeBlock>{code}</CodeBlock>
                <LazyDemo Demo={Demo} title={title} />
              </div>
            </section>
          ))}
        </main>

        <CoverageBoard />

        <section className="scope-panel" id="scope" aria-labelledby="scope-title">
          <p className="eyebrow">Honest boundaries</p>
          <h2 id="scope-title">Not every idea belongs in this SVG package</h2>
          <p>
            WebGL, general implicit-function rendering, a Svelte port, and 3D plots remain
            explicitly reviewed proposals. They need separate renderer, performance, accessibility,
            or API decisions; this showcase does not pretend those are shipped.
          </p>
        </section>

        <footer className="footer">
          Built from the local Mafs source · run <code>pnpm dev</code> in
          <code> sample-site/</code> to explore it.
        </footer>
      </div>
    </>
  )
}
