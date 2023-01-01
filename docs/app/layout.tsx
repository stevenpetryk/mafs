import Link from "next/link"
import { MafsLogo } from "../components/MafsLogo"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="flex flex-col min-h-screen items-stretch dark:bg-gray-900">
        <header className="sm:flex sm:space-x-6 sm:space-y-0 space-y-6 items-center p-6 self-center w-full max-w-5xl">
          <div className="flex-shrink-0 flex justify-center md:block md:w-56 mx-auto lg:mx-0">
            <Logo />
          </div>
          <div className="flex-grow">
            {/* The world isn't ready for search */}
            {/* <Search /> */}
          </div>

          <Nav />
        </header>

        <div>{children}</div>

        {/* Spacer */}
        <div className="my-auto" />

        <footer className="bg-gray-100 dark:text-slate-500 dark:bg-transparent dark:border-t-0 border-t py-8 mt-24">
          <div className="max-w-5xl px-6 mx-auto space-y-2">
            <p>
              &copy; {new Date().getFullYear()} Steven Petryk. Follow{" "}
              <a href="https://twitter.com/stevenpetryk">@stevenpetryk</a> for updates.
            </p>
            <p>
              <a href="https://github.com/stevenpetryk/mafs">GitHub</a>
            </p>
            <p>
              <a href="https://discord.gg/mafs">Discord</a>
            </p>
            <p>
              <a href="https://github.com/stevenpetryk/mafs/issues/new">Open an issue</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

function Logo() {
  return (
    <Link href="/" className="block outline-offset-6 w-32">
      <MafsLogo />
    </Link>
  )
}

function Nav() {
  const aClass = `
    block px-3 py-2
    rounded
    bg-transparent
    transition-colors hover:bg-gray-200 dark:hover:bg-gray-800
  `

  return (
    <nav>
      <ul className="flex justify-center -mr-2 whitespace-no-wrap">
        <li>
          <Link href="/guides/get-started/installation/" className={aClass}>
            Guides
          </Link>
        </li>
        <li>
          <a href="https://discord.gg/mafs" className={aClass} rel="noreferrer" target="_blank">
            Discord <span aria-hidden="true">↗</span>
          </a>
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
