import kebabCase from "lodash/kebabCase"
import {
  BorderSolidIcon,
  DotFilledIcon,
  GridIcon,
  SquareIcon,
  CircleIcon,
  ArrowTopRightIcon,
  DoubleArrowRightIcon,
  RotateCounterClockwiseIcon,
  TextIcon,
  MoveIcon,
  PlayIcon,
  EnterFullScreenIcon,
} from "@radix-ui/react-icons"

type Section = {
  title: string
  guides: Guide[]
}

type Guide = { title: string; slug: string; icon?: typeof BorderSolidIcon }

export const Guides: Section[] = [
  {
    title: "Get Started",
    guides: [
      { title: "Installation", slug: "installation" },
      { title: "Hello f(x)", slug: "hello-f-x" },
      { title: "Learning React", slug: "learning-react" },
    ],
  },
  {
    title: "Display",
    guides: [
      { title: "Points", icon: DotFilledIcon, slug: "points" },
      { title: "Lines", icon: BorderSolidIcon, slug: "lines" },
      { title: "Polygons", icon: SquareIcon, slug: "polygons" },
      { title: "Circles", icon: CircleIcon, slug: "circles" },
      { title: "Ellipses", icon: CircleIcon, slug: "ellipses" },
      { title: "Graphs", icon: GridIcon, slug: "graphs" },
      { title: "Text", icon: TextIcon, slug: "text" },
      { title: "Vectors", icon: ArrowTopRightIcon, slug: "vectors" },
      { title: "Vector fields", icon: DoubleArrowRightIcon, slug: "vector-fields" },
      { title: "Viewbox", icon: EnterFullScreenIcon, slug: "viewbox" },
    ],
  },
  {
    title: "Utility",
    guides: [{ title: "Transform", icon: RotateCounterClockwiseIcon, slug: "transform" }],
  },
  {
    title: "Interaction",
    guides: [{ title: "Movable points", icon: MoveIcon, slug: "movable-points" }],
  },
  {
    title: "Animation",
    guides: [{ title: "Stopwatch", icon: PlayIcon, slug: "stopwatch" }],
  },
  {
    title: "Examples",
    guides: [
      { title: "Bézier curves", slug: "bezier-curves" },
      { title: "Riemann sums", slug: "riemann-sums" },
      { title: "Fancy parabola", slug: "fancy-parabola" },
      { title: "Projectile motion", slug: "projectile-motion" },
    ],
  },
]

export function getDocContext(
  sectionSlug: string,
  guideSlug: string
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
  const sectionIndex = Guides.findIndex((section) => kebabCase(section.title) === sectionSlug)
  const section = Guides[sectionIndex]
  const guideIndex = section.guides.findIndex((guide) => guide.slug === guideSlug)
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
      guideTitle: guide.title,
      url: `/guides/${kebabCase(section.title)}/${kebabCase(guide.slug)}`,
    },
    previous: prevGuide
      ? {
          sectionTitle: prevSection.title,
          guideTitle: prevGuide.title,
          url: `/guides/${kebabCase(prevSection.title)}/${kebabCase(prevGuide.slug)}`,
        }
      : null,
    next: nextGuide
      ? {
          sectionTitle: nextSection.title,
          guideTitle: nextGuide.title,
          url: `/guides/${kebabCase(nextSection.title)}/${kebabCase(nextGuide.slug)}`,
        }
      : null,
  }
}
