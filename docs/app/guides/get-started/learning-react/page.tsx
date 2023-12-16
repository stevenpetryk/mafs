const REACT_DOCS = "https://react.dev/"
const REACT_GET_STARTED = "https://react.dev/learn"
const REACT_CRA = "https://react.dev/learn/start-a-new-react-project"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learning React",
}

function Page() {
  return (
    <>
      <p>
        Mafs is a <ExtLink href={REACT_DOCS}>React</ExtLink> library. React is itself a library for
        building web applications—perhaps even the most popular frontend library in the world at the
        moment.
      </p>

      <p>This library was build on top of React for a few reasons:</p>

      <ul>
        <li>
          <strong>React is well-documented and easy to learn</strong>. Even if you've never used
          React, you can get up and running with Mafs quickly.
        </li>
        <li>
          <strong>React encourages writing declarative code</strong>. This library relies heavily on
          the declarative model of programming to make building a visualization feel more
          intuitive—just put whatever components you want on the screen, and declare what they
          should look like for a given state.
        </li>
        <li>
          <strong>React is pretty performant by default</strong>. While you can take a few steps to
          improve the performance of your Mafs visualization, it's usually performant enough to not
          think about it at all. This is largely because of abstractions built into React that Mafs
          relies on heavily—things like memoization, context, and batched updates.
        </li>
      </ul>

      <h2>Where to start</h2>

      <p>
        <ExtLink href={REACT_GET_STARTED}>React's own documentation</ExtLink> is a great place to
        start. If you're starting from complete scratch, and <em>just want to play with Mafs</em>,
        check out the <ExtLink href={REACT_CRA}>Create a New React App</ExtLink> section to get up
        and running quickly.
      </p>
    </>
  )
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  )
}

export default Page
