import Link from "next/link"

import RiemannHomepage from "../components/RiemannHomepage"
import CodeAndExample from "../components/CodeAndExample"
import { Features } from "../components/homepage/Features"
import { InstallCommand } from "../components/homepage/InstallCommand"

import Tangent from "guide-examples/homepage/Tangent"

const examples = [
  { title: "Bézier curves", href: "/guides/examples/bezier-curves/" },
  { title: "Riemann sums", href: "/guides/examples/riemann-sums/" },
  { title: "Fancy parabola", href: "/guides/examples/fancy-parabola/" },
  { title: "Projectile motion", href: "/guides/examples/projectile-motion/" },
]

export default function Home() {
  return (
    <main>
      <div className="grid isolate">
        <div className="text-center pointer-events-none" style={{ gridArea: "1 / 1 / 1 / 1" }}>
          <div className="pointer-events-auto max-w-5xl mx-auto space-y-10 mt-12 sm:mt-24">
            <div className="space-y-4 px-6">
              <h1 className="text-4xl sm:text-6xl font-normal font-display text-balance">
                React components for interactive math
              </h1>
              <p className="text-lg sm:text-2xl">
                Build interactive, animated visualizations with declarative code.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 px-6">
              <Link
                className="button transition-colors font-bold pointer-events-auto"
                href="/guides/get-started/installation/"
              >
                Get started <span aria-hidden="true">→</span>
              </Link>
              <InstallCommand />
            </div>
          </div>
        </div>

        <div
          className="homepage-mafs -mt-24 sm:mt-0 col-start-1 row-start-1 touch-none"
          style={{
            clipPath: "polygon(0% 68%, 85% 68%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        >
          <RiemannHomepage />
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-6 mt-16 sm:mt-24 space-y-10">
        <div className="grid gap-4 lg:gap-12 lg:grid-cols-2 lg:items-end">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              It&rsquo;s just React
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal font-display text-balance">
              Describe the math. Mafs handles the rest.
            </h2>
          </div>
          <p className="text-lg leading-relaxed">
            Write a function, constrain a point to it, and draw its tangent line. No imperative
            canvas code, no event listeners: state flows through your components like any other
            React app. Go ahead, drag the point along the curve.
          </p>
        </div>

        <div className="md:shadow-xl md:rounded-lg">
          <CodeAndExample example={Tangent} collapsible={false} />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-24 sm:mt-32 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-normal font-display">Everything on the plane</h2>
          <p className="text-lg">
            Every card below is a live Mafs view. Most of them are interactive.
          </p>
        </div>

        <Features />
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-24 sm:mt-32">
        <div className="rounded-2xl bg-gray-900 dark:bg-gray-800 text-gray-100 px-6 py-12 sm:p-16 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-normal font-display text-white dark:text-white">
              Ready to make some math move?
            </h2>
            <p className="text-lg text-gray-300">
              Start with the guides, or see what a few dozen lines can do.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {examples.map(({ title, href }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-full border border-gray-700 hover:border-gray-400 hover:bg-white/5 transition-colors"
              >
                {title}
              </Link>
            ))}
          </div>

          <Link
            className="button transition-colors font-bold inline-block"
            href="/guides/get-started/installation/"
          >
            Read the guides <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
