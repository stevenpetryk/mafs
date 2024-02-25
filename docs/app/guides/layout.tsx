import GuidesSidebar from "./sidebar"
import ScrollTop from "components/ScrollTop"
import { Title } from "./title"
import { NextPrevButtons } from "./next-prev-buttons"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | Guides | Mafs",
    absolute: "Guides | Mafs",
  },
}

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="max-w-5xl p-6 py-12 mx-auto md:flex space-y-6 md:space-y-0 md:space-x-6">
        <div
          className={`
            rounded-md
            flex-shrink-0

            bg-gray-200 dark:bg-gray-800 dark:border-gray-700 border md:bg-transparent md:border-none
            md:w-56 mb-12

            md:pb-12 md:pr-4
          `}
        >
          <GuidesSidebar />
        </div>

        <main id="main" className="space-y-6 flex-grow md:w-0">
          <h1 className="flex items-center gap-3">
            <Title />
          </h1>

          <div className="prose space-y-6">{children}</div>

          <NextPrevButtons />
        </main>
      </div>

      <ScrollTop />
    </>
  )
}
