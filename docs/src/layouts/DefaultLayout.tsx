import * as React from "react"
import { Link } from "gatsby"

import { Helmet } from "react-helmet"

import LogoImage from "./mafs.svg"
import Favicon from "./favicon.svg"

const DefaultLayout: React.FC<{ title?: string }> = ({ children, title }) => (
  <>
    <Helmet>
      <title>{title ? `${title} | ` : ""}Mafs: React components for math visualization</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" type="image/png" href={Favicon} />
    </Helmet>

    <header className="sm:flex sm:space-x-6 sm:space-y-0 space-y-6 items-center p-6 mx-auto max-w-5xl">
      <div className="flex-shrink-0 flex justify-center md:block md:w-56 mx-auto lg:mx-0">
        <Logo />
      </div>
      <div className="flex-grow">
        {/* The world isn't ready for search */}
        {/* <Search /> */}
      </div>

      <Nav />
    </header>

    <main>{children}</main>

    <footer className="bg-gray-100 border-t py-8 mt-24">
      <div className="max-w-5xl px-6 mx-auto space-y-2">
        <p>
          &copy; {new Date().getFullYear()} Steven Petryk. Follow{" "}
          <a href="https://twitter.com/stevenpetryk">@stevenpetryk</a> for updates.
        </p>
        <p>
          <a href="https://github.com/stevenpetryk/mafs">GitHub</a>
        </p>
        <p>
          <a href="https://github.com/stevenpetryk/mafs/issues/new">Open an issue</a>
        </p>
      </div>
    </footer>
  </>
)

function Logo() {
  return (
    <Link to="/" className="block outline-offset-6 w-32">
      <img src={LogoImage} alt="Mafs" />
    </Link>
  )
}

function Nav() {
  const aClass = `
    block px-3 py-2
    rounded
    bg-transparent
    transition-colors hover:bg-gray-200
  `

  return (
    <nav>
      <ul className="flex justify-center -mr-2 whitespace-no-wrap">
        <li>
          <Link to="/guides/get-started/installation/" className={aClass}>
            Guides
          </Link>
        </li>
        <li>
          <a
            href="https://github.com/stevenpetryk/mafs"
            className={aClass}
            rel="noreferrer"
            target="_blank"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default DefaultLayout
