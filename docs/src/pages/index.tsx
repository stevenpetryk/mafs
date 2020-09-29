import React from "react"
import { Link, PageProps } from "gatsby"
import DefaultLayout from "../layouts/DefaultLayout"

import RiemannHomepage from "../guide-examples/examples/RiemannHomepage"

const Home: React.VFC<PageProps> = () => {
  return (
    <DefaultLayout>
      <div className="grid overflow-hidden">
        <div
          className="homepage-mafs unround-mafs -mt-24 sm:mt-0"
          style={{ gridArea: "1 / 1 / 1 / 1" }}
        >
          <RiemannHomepage />
        </div>

        <div className="text-center pointer-events-none" style={{ gridArea: "1 / 1 / 1 / 1" }}>
          <div className=" pointer-events-auto max-w-5xl mx-auto space-y-12 mt-12 sm:mt-24">
            <div className="space-y-4 px-6">
              <h1 className="text-4xl sm:text-6xl font-normal font-display">
                Components for math visualization
              </h1>
              <p className="text-lg sm:text-2xl text-black">
                Build interactive, animated visualizations with declarative code.
              </p>
            </div>

            <p>
              <Link
                className="button transition-colors font-bold pointer-events-auto"
                to="/guides/get-started/installation/"
              >
                Get started <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default Home
