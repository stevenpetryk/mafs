"use client"

import * as React from "react"
import Link from "next/link"
import {
  Mafs,
  Coordinates,
  Plot,
  Polygon,
  Point,
  Vector,
  Circle,
  Line,
  LaTeX,
  Transform,
  Theme,
  useMovablePoint,
  useStopwatch,
  vec,
} from "mafs"

const HEIGHT = 220

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])
  return reduced
}

/** A stopwatch that runs forever, unless the viewer prefers reduced motion. */
function useLoopingTime(frozenAt: number) {
  const reduced = usePrefersReducedMotion()
  const { time, start, stop } = useStopwatch()
  React.useEffect(() => {
    if (reduced) stop()
    else start()
  }, [reduced, start, stop])
  return reduced ? frozenAt : time
}

function PlotsDemo() {
  const a = useMovablePoint([1.5, 0], {
    constrain: ([x]) => [Math.min(Math.max(x, 0.5), 3.5), 0],
  })
  const k = Math.round(a.x * 2) / 2

  return (
    <Mafs height={HEIGHT} viewBox={{ x: [-1.6, 3.8], y: [-1.2, 1.2] }} pan={false}>
      <Coordinates.Cartesian subdivisions={2} />
      <Plot.Parametric
        domain={[0, 4 * Math.PI]}
        xy={(t) => [Math.cos(k * t) * Math.cos(t), Math.cos(k * t) * Math.sin(t)]}
        color={Theme.pink}
      />
      {a.element}
    </Mafs>
  )
}

function DragDemo() {
  const a = useMovablePoint([-2, -1])
  const b = useMovablePoint([2, -1.2])
  const c = useMovablePoint([0.4, 1.6])

  return (
    <Mafs height={HEIGHT} viewBox={{ x: [-3, 3], y: [-2, 2] }} pan={false}>
      <Coordinates.Cartesian subdivisions={2} />
      <Polygon points={[a.point, b.point, c.point]} color={Theme.blue} />
      <Circle center={vec.midpoint(a.point, b.point)} radius={0.06} />
      {a.element}
      {b.element}
      {c.element}
    </Mafs>
  )
}

function FieldDemo() {
  const sink = useMovablePoint([0.5, 0.5], { color: Theme.orange })

  return (
    <Mafs height={HEIGHT} viewBox={{ x: [-3, 3], y: [-2, 2] }} pan={false}>
      <Coordinates.Cartesian subdivisions={2} />
      <Plot.VectorField
        xy={([x, y]) => {
          const d = vec.sub(sink.point, [x, y])
          return vec.add(vec.scale(d, 0.25), vec.scale(vec.rotate(d, Math.PI / 2), 0.35))
        }}
        step={0.75}
        xyOpacity={(p) => Math.min(1, vec.dist(p, sink.point) / 2.5)}
        color={Theme.green}
      />
      {sink.element}
    </Mafs>
  )
}

function AnimationDemo() {
  const t = useLoopingTime(0.7)
  const angle = t * 1.2
  const tip: vec.Vector2 = [1.4 * Math.cos(angle), 1.4 * Math.sin(angle)]

  return (
    <Mafs height={HEIGHT} viewBox={{ x: [-3, 3], y: [-1.8, 1.8] }} pan={false}>
      <Coordinates.Cartesian subdivisions={2} />
      <Circle center={[0, 0]} radius={1.4} strokeStyle="dashed" fillOpacity={0} />
      <Plot.OfX
        y={(x) => 1.4 * Math.sin(angle - (x - 1.4) * 1.5)}
        domain={[1.4, 3]}
        color={Theme.violet}
      />
      <Vector tip={tip} color={Theme.violet} />
      <Line.Segment point1={tip} point2={[1.4, tip[1]]} style="dashed" opacity={0.5} />
      <Point x={1.4} y={tip[1]} color={Theme.violet} />
    </Mafs>
  )
}

function TransformDemo() {
  const t = useLoopingTime(0.5)
  const square: vec.Vector2[] = [
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
    [-0.5, 0.5],
  ]

  return (
    <Mafs height={HEIGHT} viewBox={{ x: [-3, 3], y: [-1.8, 1.8] }} pan={false}>
      <Coordinates.Cartesian subdivisions={2} />
      {[-1.8, 0, 1.8].map((x, i) => (
        <Transform key={x} translate={[x, 0]}>
          <Transform rotate={t * (i + 1) * 0.6} scale={1 + 0.25 * Math.sin(t * 2 + i)}>
            <Polygon points={square} color={[Theme.red, Theme.yellow, Theme.indigo][i]} />
          </Transform>
        </Transform>
      ))}
    </Mafs>
  )
}

function LatexDemo() {
  const p = useMovablePoint([1, 1], { color: Theme.indigo })
  const r = Math.hypot(p.x, p.y)
  const theta = Math.atan2(p.y, p.x)

  return (
    <Mafs height={HEIGHT} viewBox={{ x: [-3, 3], y: [-1.8, 1.8] }} pan={false}>
      <Coordinates.Polar subdivisions={2} lines={1} />
      <Vector tip={p.point} color={Theme.indigo} />
      <LaTeX
        at={[-1.5, -1.3]}
        tex={String.raw`re^{i\theta} = ${r.toFixed(2)}\,e^{${theta.toFixed(2)}i}`}
      />
      {p.element}
    </Mafs>
  )
}

const features = [
  {
    title: "Plot anything",
    body: "Functions of x or y, parametric curves, inequalities and vector fields.",
    href: "/guides/display/plots/",
    hint: "Drag to change the petals",
    Demo: PlotsDemo,
  },
  {
    title: "Make it draggable",
    body: "One hook gives you a point people can grab, with mouse, touch or keyboard.",
    href: "/guides/interaction/movable-points/",
    hint: "Drag the corners",
    Demo: DragDemo,
  },
  {
    title: "Vector fields",
    body: "Visualize flows with a single function from a point to a vector.",
    href: "/guides/display/plots/",
    hint: "Move the sink",
    Demo: FieldDemo,
  },
  {
    title: "Animate",
    body: "useStopwatch hands you time. Everything else is just math.",
    href: "/guides/experimental/animation/",
    Demo: AnimationDemo,
  },
  {
    title: "Transform",
    body: "Translate, rotate, scale and shear whole groups of shapes at once.",
    href: "/guides/display/transform/",
    Demo: TransformDemo,
  },
  {
    title: "Typeset with LaTeX",
    body: "Drop KaTeX-rendered math right onto the coordinate plane.",
    href: "/guides/experimental/latex/",
    hint: "Drag the vector",
    Demo: LatexDemo,
  },
]

export function Features() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(({ title, body, href, hint, Demo }) => (
        <div
          key={title}
          className="flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm"
        >
          <div className="feature-mafs relative">
            <Demo />
            {hint && (
              <span className="pointer-events-none absolute bottom-2 right-2 text-xs px-2 py-1 rounded-full bg-black/60 text-white/80">
                {hint}
              </span>
            )}
          </div>
          <div className="p-5 space-y-1 flex-grow">
            <h3 className="text-lg">
              <Link href={href} className="hover:underline">
                {title} <span aria-hidden="true">→</span>
              </Link>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
