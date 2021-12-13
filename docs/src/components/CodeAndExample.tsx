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
  font-family: 'Computer Modern Serif';
}
`

const entry = `
import React from "react"
import { render } from "react-dom"
import "mafs/build/index.css"
import "./index.css"

import App from './example'
render(<App />, document.getElementById('root'))
`

const CodeAndExample: React.VFC<Props> = ({ source }) => {
  let desiredHeight: number = 500
  try {
    desiredHeight = +source.match(/height=\{(\d+)\}/)[1]
  } catch (_error) {}

  source = source.replace(/import React.*\n/g, "").replace(/\/\/ prettier-ignore/g, "")

  return (
    <div className="rounded-md overflow-hidden">
      <SandpackProvider
        customSetup={{
          files: {
            "/src/example.tsx": { code: source.trim(), active: true },
            "/src/index.css": {
              code: css.trim(),
              hidden: true,
            },
            "/src/index.tsx": {
              code: entry.trim(),
              hidden: true,
            },
          },
          dependencies: {
            react: packageJson.devDependencies.react,
            "react-dom": packageJson.devDependencies["react-dom"],
            "react-scripts": "^4.0.0",
            mafs: packageJson.version,
            "vec-la": packageJson.dependencies["vec-la"],
            "lodash.clamp": "^4",
            "lodash.range": "^3",
            "lodash.sumby": "^4",
          },
          entry: "/src/index.tsx",
          main: "/src/index.tsx",
          environment: "create-react-app",
        }}
      >
        <SandpackThemeProvider theme="night-owl">
          <div className="flex flex-col gap-1 bg-gray-800">
            <SandpackPreview
              customStyle={{ height: desiredHeight }}
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
