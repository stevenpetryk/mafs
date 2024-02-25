import CodeAndExample from "components/CodeAndExample"
import * as ProjectileMotion from "guide-examples/examples/ProjectileMotion"

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
