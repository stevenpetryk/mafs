import kebabCase from "lodash/kebabCase"
import {
  CardStackIcon,
  BorderSolidIcon,
  DotFilledIcon,
  GridIcon,
  SquareIcon,
  CircleIcon,
  ArrowTopRightIcon,
  RotateCounterClockwiseIcon,
  TextIcon,
  CursorArrowIcon,
  PlayIcon,
} from "@radix-ui/react-icons"
import { FunctionIcon, EllipseIcon } from "components/icons"

type Section = {
  title: string
  guides: Guide[]
}

type Guide = {
  title: string
  slug: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.FunctionComponent<any>
}

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
      { title: "Mafs", icon: CardStackIcon, slug: "mafs" },
      { title: "Coordinates", icon: GridIcon, slug: "coordinates" },
      { title: "Points", icon: DotFilledIcon, slug: "points" },
      { title: "Lines", icon: BorderSolidIcon, slug: "lines" },
      { title: "Polygons", icon: SquareIcon, slug: "polygons" },
      { title: "Circles", icon: CircleIcon, slug: "circles" },
      { title: "Ellipses", icon: EllipseIcon, slug: "ellipses" },
      { title: "Plots", icon: FunctionIcon, slug: "plots" },
      { title: "Text", icon: TextIcon, slug: "text" },
      { title: "Vectors", icon: ArrowTopRightIcon, slug: "vectors" },
    ],
  },
  {
    title: "Utility",
    guides: [{ title: "Transform", icon: RotateCounterClockwiseIcon, slug: "transform" }],
  },
  {
    title: "Interaction",
    guides: [{ title: "Movable points", icon: CursorArrowIcon, slug: "movable-points" }],
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
  const flatGuidesAndSections = Guides.flatMap((section) =>
    section.guides.map((guide) => [section, guide] as const)
  )

  const currentIndex = flatGuidesAndSections.findIndex(
    ([section, guide]) => kebabCase(section.title) === sectionSlug && guide.slug === guideSlug
  )

  const [section, guide] = flatGuidesAndSections[currentIndex]
  const [prevSection, prevGuide] = flatGuidesAndSections[currentIndex - 1] ?? [null, null]
  const [nextSection, nextGuide] = flatGuidesAndSections[currentIndex + 1] ?? [null, null]

  return {
    current: {
      sectionTitle: section.title,
      guideTitle: guide.title,
      url: `/guides/${kebabCase(section.title)}/${guide.slug}`,
    },
    previous: prevGuide
      ? {
          sectionTitle: prevSection.title,
          guideTitle: prevGuide.title,
          url: `/guides/${kebabCase(prevSection.title)}/${prevGuide.slug}`,
        }
      : null,
    next: nextGuide
      ? {
          sectionTitle: nextSection.title,
          guideTitle: nextGuide.title,
          url: `/guides/${kebabCase(nextSection.title)}/${nextGuide.slug}`,
        }
      : null,
  }
}
