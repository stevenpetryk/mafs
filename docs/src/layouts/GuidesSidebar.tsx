import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import kebabCase from "lodash.kebabcase"

import { GuidesSidebarQuery } from "./__generated__/GuidesSidebarQuery"
import fancyFx from "helpers/fancyFx"

const GuidesSidebar: React.VFC = () => {
  const sections = useSectionsAndPages()

  const sectionsElements = sections.map((section, index) => (
    <div key={index}>
      <h2 className="text-lg font-semibold">{section.title}</h2>

      <ul>
        {section.pages.map((page, index) => (
          <GuideLink to={page.url} key={index}>
            {fancyFx(page.title)}
          </GuideLink>
        ))}
      </ul>
    </div>
  ))

  return (
    <nav>
      <details className="md:hidden space-y-4">
        <summary className="text-xl font-bold p-4 cursor-default">All guides</summary>
        <div className="p-4 pt-0 space-y-4">{sectionsElements}</div>
      </details>

      <div className="hidden md:block space-y-4">{sectionsElements}</div>
    </nav>
  )
}

export default GuidesSidebar

function useSectionsAndPages() {
  const path = require("path")

  const data = useStaticQuery<GuidesSidebarQuery>(graphql`
    query GuidesSidebarQuery {
      allGuideSectionsJson(sort: { fields: order }) {
        edges {
          node {
            name
          }
        }
      }

      allJavascriptFrontmatter(sort: { fields: frontmatter___order }) {
        edges {
          node {
            frontmatter {
              title
            }
            node {
              relativePath
              extension
            }
          }
        }
      }
    }
  `)

  return data.allGuideSectionsJson.edges.map((edge) => {
    const sectionSlug = kebabCase(edge.node.name)

    const pages = data.allJavascriptFrontmatter.edges.filter((edge) =>
      edge.node.node.relativePath.startsWith(`guides/${sectionSlug}`)
    )

    return {
      title: edge.node.name,
      slug: sectionSlug,
      pages: pages.map((page) => {
        const { relativePath, extension } = page.node.node
        const pageSlug = path.basename(relativePath, `.${extension}`)

        return {
          title: page.node.frontmatter.title,
          slug: pageSlug,
          url: path.join("/guides", sectionSlug, pageSlug, "/"),
        }
      }),
    }
  })
}

function GuideLink({ to, children }: React.PropsWithChildren<{ to: string }>) {
  return (
    <li>
      <Link
        to={to}
        className="block hover:text-blue-700 focus:text-blue-700 hover:underline"
        activeClassName="text-blue-700 font-bold active-sidebar-link"
      >
        {children}
      </Link>
    </li>
  )
}
