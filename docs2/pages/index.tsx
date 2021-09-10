import type { NextPage } from "next"
import DefaultLayout from "../layouts/DefaultLayout"
import RiemannHomepage from "../examples/RiemannHomepage"
import Link from "next/link"

const Home: NextPage = () => {
  return (
    <>
      <DefaultLayout>
        <div className="grid overflow-hidden">
          <div
            className="text-center pointer-events-none"
            style={{ gridArea: "1 / 1 / 1 / 1", zIndex: 1 }}
          >
            <div className="max-w-5xl mx-auto space-y-12 mt-12 sm:mt-24">
              <div className="space-y-4 px-6 pointer-events-auto">
                <h1 className="text-4xl sm:text-6xl font-normal font-display">
                  Components for math visualization
                </h1>
                <p className="text-lg sm:text-2xl text-black">
                  Build interactive, animated visualizations with declarative code.
                </p>
              </div>

              <p>
                <Link href="/guides/get-started/installation/">
                  <a
                    className="
                      focus:ring-4 focus:ring-blue-300
                      button transition-colors font-bold pointer-events-auto
                    "
                  >
                    Get started <span aria-hidden="true">→</span>
                  </a>
                </Link>
              </p>
            </div>
          </div>

          <div
            className="homepage-mafs unround-mafs -mt-24 sm:mt-0"
            style={{ gridArea: "1 / 1 / 1 / 1" }}
          >
            <RiemannHomepage />
          </div>
        </div>
      </DefaultLayout>
    </>
  )
}

export default Home
