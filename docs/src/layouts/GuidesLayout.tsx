import React from "react"
import DefaultLayout from "./DefaultLayout"
import GuidesSidebar from "./GuidesSidebar"
import fancyFx from "helpers/fancyFx"

type GuidesLayoutProps = React.PropsWithChildren<{ title: string }>

const GuidesLayout: React.FC<GuidesLayoutProps> = ({ children, title }) => (
  <DefaultLayout title={`${title ? `${title} | ` : ""}Guides`}>
    <div className="max-w-5xl p-6 py-12 mx-auto md:flex space-y-6 md:space-y-0 md:space-x-6">
      <div
        className={`
        rounded-md
        flex-shrink-0

        bg-gray-200 border md:bg-transparent md:border-none
        md:w-56 mb-12

        md:pb-12 md:pr-4
      `}
      >
        <GuidesSidebar />
      </div>

      <main className="prose space-y-6 flex-grow md:w-0">
        <h1>{fancyFx(title)}</h1>

        {children}
      </main>
    </div>
  </DefaultLayout>
)

export default GuidesLayout
