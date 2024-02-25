import CodeAndExample from "components/CodeAndExample"
import ProjectileMotion from "guide-examples/examples/ProjectileMotion"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projectile motion",
}

function ProjectilePage() {
  return (
    <>
      <p>
        This example combines interaction and animation to show the freefall trajectory of a
        launched object. Some regular, HTML <code>&lt;button&gt;</code>s are used to start and stop
        the animation.
      </p>

      <CodeAndExample example={ProjectileMotion} />
    </>
  )
}

export default ProjectilePage
