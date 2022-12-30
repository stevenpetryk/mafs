import kebabCase from "lodash/kebabCase"

type Section = {
  title: string
  guides: Guide[]
}

type Guide = string

export const Guides: Section[] = [
  {
    title: "Get Started",
    guides: ["Installation", "Hello f(x)", "Learning React"],
  },
  {
    title: "Display",
    guides: [
      "Points",
      "Lines",
      "Polygons",
      "Ellipses & circles",
      "Graphs",
      "Vectors",
      "Vector fields",
      "Text",
    ],
  },
  {
    title: "Interaction",
    guides: ["Movable points"],
  },
  {
    title: "Animation",
    guides: ["Stopwatch"],
  },
  {
    title: "Examples",
    guides: ["Bézier curves", "Riemann sums", "Fancy parabola", "Projectile motion"],
  },
]

export function getDocContext(
  sectionTitle: string,
  guideTitle: string
): {
  current: {
    sectionTitle: string
    guideTitle: string
    url: string
  }

  previous: {
    sectionTitle: string
    guideTitle: string
    url: string
  } | null

  next: {
    sectionTitle: string
    guideTitle: string
    url: string
  } | null
} {
  const sectionIndex = Guides.findIndex((section) => kebabCase(section.title) === sectionTitle)
  const section = Guides[sectionIndex]
  const guideIndex = section.guides.findIndex((guide) => kebabCase(guide) === guideTitle)
  const guide = section.guides[guideIndex]

  // Sections contain guides. We want to find the next and previous guides, given that we may need
  // to move to the next or previous section.

  let prevSectionIndex = sectionIndex
  let nextSectionIndex = sectionIndex
  let prevGuideIndex = guideIndex - 1
  let nextGuideIndex = guideIndex + 1

  if (prevGuideIndex < 0) {
    prevSectionIndex--
    prevGuideIndex = Guides[prevSectionIndex]?.guides.length - 1
  }

  if (nextGuideIndex >= section.guides.length) {
    nextSectionIndex++
    nextGuideIndex = 0
  }

  const prevSection = Guides[prevSectionIndex]
  const nextSection = Guides[nextSectionIndex]
  const prevGuide = prevSection?.guides[prevGuideIndex]
  const nextGuide = nextSection?.guides[nextGuideIndex]

  return {
    current: {
      sectionTitle: section.title,
      guideTitle: guide,
      url: `/guides/${kebabCase(section.title)}/${kebabCase(guide)}`,
    },
    previous: prevGuide
      ? {
          sectionTitle: prevSection.title,
          guideTitle: prevGuide,
          url: `/guides/${kebabCase(prevSection.title)}/${kebabCase(prevGuide)}`,
        }
      : null,
    next: nextGuide
      ? {
          sectionTitle: nextSection.title,
          guideTitle: nextGuide,
          url: `/guides/${kebabCase(nextSection.title)}/${kebabCase(nextGuide)}`,
        }
      : null,
  }
}
