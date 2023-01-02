import Link from "next/link"

import RiemannHomepage from "../components/RiemannHomepage"

export default function Home() {
  return (
    <main>
      <div className="grid isolate">
        <div className="text-center pointer-events-none" style={{ gridArea: "1 / 1 / 1 / 1" }}>
          <div className="pointer-events-auto max-w-5xl mx-auto space-y-12 mt-12 sm:mt-24">
            <div className="space-y-4 px-6">
              <h1 className="text-4xl sm:text-5xl font-normal font-display">
                React components for interactive math
              </h1>
              <p className="text-lg sm:text-2xl">
                Build interactive, animated visualizations with declarative code.
              </p>
            </div>

            <p>
              <Link
                className="button transition-colors font-bold pointer-events-auto"
                href="/guides/get-started/installation/"
              >
                Get started <span aria-hidden="true">→</span>
              </Link>
            </p>
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
    </main>
  )
}
