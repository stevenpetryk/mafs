import * as React from "react"
import GuidesLayout from "layouts/GuidesLayout"
import { Guide } from "guide"

import CodeAndExample from "components/CodeAndExample"
import ProjectileMotion from "guide-examples/examples/ProjectileMotion"
import ProjectileMotionSource from "!raw-loader!guide-examples/examples/ProjectileMotion.tsx"

export const frontmatter: Guide = {
  title: "Projectile motion",
  order: 3,
}

const ProjectilePage: React.VFC = () => (
  <GuidesLayout title={frontmatter.title}>
    <p>
      This example combines interaction and animation to show the freefall trajectory of a launched
      object. Some regular, HTML <code>&lt;button&gt;</code>s are used to start and stop the
      animation.
    </p>

    <CodeAndExample source={ProjectileMotionSource} component={<ProjectileMotion />} />
  </GuidesLayout>
)

export default ProjectilePage
