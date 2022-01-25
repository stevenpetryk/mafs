import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react"

const packageJson = require("../../../package.json")

interface Props {
  source: string
}

const css = `
@import "https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/fonts.css";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui;
}

.MafsView {
  font-family: 'Computer Modern Serif';
}
`

const entry = (height: number) => `
window.MAFS_HEIGHT = ${height};

import React from "react";
import { render } from "react-dom";
import "mafs/build/index.css";
import "./index.css";

import App from './example';
render(<App />, document.getElementById('root'));

window.parent.postMessage(document.body.scrollHeight, '*');
`

const CodeAndExample: React.VFC<Props> = ({ source }) => {
  const query = useStaticQuery(graphql`
    query {
      allRawCode {
        edges {
          node {
            name
            extension
            content
          }
        }
      }
    }
  `)
  const mafsFiles = Object.fromEntries(
    query.allRawCode.edges
      .map(({ node }) => node)
      .map(({ name, extension, content }) => [
        `/node_modules/mafs/build/${name}.${extension}`,
        { code: content || "", hidden: true },
      ])
  )

  const [desiredHeight, setDesiredHeight] = React.useState(() => {
    try {
      return +source.match(/@example_height (\d+)/)[1]
    } catch (_error) {
      return 300
    }
  })

  const [iframeHeight, setIframeHeight] = React.useState(desiredHeight)

  source = source
    .replace(/import React.*\n/g, "")
    .replace(/\/\/ prettier-ignore/g, "")
    .replace(/\/\/\s+@example_height\s+(\d+)\n/g, "")

  const newLocal = {
    "/src/example.tsx": { code: source.trim(), active: true },
    "/src/index.css": {
      code: css.trim(),
      hidden: true,
    },
    "/src/index.tsx": {
      code: entry(desiredHeight).trim(),
      hidden: true,
    },
    "/node_modules/mafs/package.json": {
      code: JSON.stringify(packageJson),
      hidden: true,
    },
    ...mafsFiles,
  }

  const extraDeps = Object.fromEntries(
    Object.entries({
      "lodash.range": "^3.0.0",
      "lodash.clamp": "^4.0.0",
      "lodash.sumby": "^4.0.0",
      "js-easing-functions": "^1.0.3",
    }).filter(([packageName]) => source.includes(packageName))
  )

  const ref = React.useRef<SandpackProvider>(null)

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      const iframe = ref.current.preregisteredIframes[0]
      if (!iframe) return

      if (typeof event.data === "number" && event.source === iframe.contentWindow) {
        iframe.style.height = `${event.data}px`

        setIframeHeight(event.data)
        window.removeEventListener("message", onMessage)
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return (
    <div className="rounded-md overflow-hidden">
      <SandpackProvider
        ref={ref}
        customSetup={{
          files: newLocal,
          dependencies: {
            react: packageJson.devDependencies.react,
            "react-dom": packageJson.devDependencies["react-dom"],
            "react-scripts": "^4.0.0",
            ...extraDeps,
            ...packageJson.dependencies,
          },
          entry: "/src/index.tsx",
          main: "/src/index.tsx",
          environment: "create-react-app",
        }}
      >
        <SandpackThemeProvider theme="night-owl">
          <div className="flex flex-col gap-1 bg-gray-800">
            <SandpackPreview
              customStyle={{ height: iframeHeight }}
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
            />
            <SandpackCodeEditor />
          </div>
        </SandpackThemeProvider>
      </SandpackProvider>
    </div>
  )
}

export default CodeAndExample
