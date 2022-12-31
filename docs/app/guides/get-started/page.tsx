import { Guides } from "../guides"

import kebabCase from "lodash/kebabCase"

async function Page({ params }: { params: { page: string[] } }) {
  const section = Guides.find((section) => kebabCase(section.title) === params.page[0])
  const guide = section?.guides.find((guide) => kebabCase(guide.title) === params.page[1])!

  return (
    <>
      <h1>asdf</h1>
      {/* <Content /> */}
    </>
  )
}

export default Page
