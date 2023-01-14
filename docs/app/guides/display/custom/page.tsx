import Link from "next/link"

export default function CustomPage() {
  return (
    <>
      <p>
        Sometimes, Mafs simply won't have the component you need. When that happens, there are two
        options:
      </p>

      <ul>
        <li>
          <Link href="https://github.com/stevenpetryk/mafs/issues">Open a feature request</Link>.
          There may already be an open issue for your use case.
        </li>
        <li>
          Write a <strong>custom Mafs component</strong>.
        </li>

        <h2>Custom components</h2>
      </ul>
    </>
  )
}
