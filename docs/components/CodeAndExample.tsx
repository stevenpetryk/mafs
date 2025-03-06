"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import { StackBlitzIcon } from "./icons"
import { createStarryNight } from "@wooorm/starry-night"
import Editor from "react-simple-code-editor"
import { useRunner } from "react-runner"

// @ts-expect-error this works but typescript doesn't like it lol
import tsx from "@wooorm/starry-night/source.tsx"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"

// @ts-expect-error yk how it is
import { Fragment, jsx, jsxs } from "react/jsx-runtime"

const starryNightPromise = createStarryNight([tsx])

import sdk from "@stackblitz/sdk"
import endent from "endent"

import * as mafs from "mafs"
import * as lodash from "lodash";

import "./CodeAndExample.css"

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  example: any
  collapsible?: boolean
}

function CodeAndExample({ collapsible: collapsibleProp = true, example }: Props) {
  const typedExample = example as {
    $component: React.ComponentType
    $source: string
    $highlightedSource: React.ReactNode
    $width: number
    $height: number
  }

  const runnerScope = React.useMemo(
    () => ({
      import: {
        mafs: {
          ...mafs,
          Mafs: (props: mafs.MafsProps) => (
            <mafs.Mafs
              {...props}
              width={
                props.width
                  ? props.width
                  : isNaN(typedExample.$width)
                    ? undefined
                    : typedExample.$width
              }
              height={
                props.height
                  ? props.height
                  : isNaN(typedExample.$height)
                    ? undefined
                    : typedExample.$height
              }
            />
          ),
        },
        lodash
      },
    }),
    [],
  )

  const starryNight = React.use(starryNightPromise)
  const scope = starryNight.flagToScope("tsx")!

  const Component = typedExample.$component
  const [source, setSource] = React.useState(typedExample.$source)
  const highlightedSource = typedExample.$highlightedSource

  const [clientLoaded, setClientLoaded] = React.useState(false)
  React.useEffect(() => {
    setClientLoaded(true)
  }, [])

  if (typeof Component !== "function") {
    throw new Error(`CodeAndExample: expected example to be a component ${source}`)
  }

  const collapsible = collapsibleProp && source.split("\n").length > 10
  const [expandedState, setExpanded] = React.useState(false)
  const expanded = collapsible ? expandedState : true

  const { element, error } = useRunner({ code: source, scope: runnerScope })

  return (
    <div className="w-auto sm:text-base text-sm -m-6 md:m-0 dark:shadow-xl">
      <div className={`unround-mafs z-10 relative`}>
        {!clientLoaded ? <Component /> : element}
        <div
          className="w-full h-full absolute top-0 left-0 bg-black/50 p-12"
          style={{ display: error ? "block" : "none" }}
        >
          <div className="w-full h-full bg-gray-900 dark:bg-black text-gray-100 rounded-lg border-[1px] border-red-300 p-4">
            <h4 className="text-gray-100">An error occured in your code!</h4>
            <hr className="my-2" />
            <code>{error}</code>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className={`
          bg-gray-900 dark:bg-black
          border-gray-900 border-t text-gray-100
          md:rounded-b-lg
        `}
        >
          <div className="grid grid-cols-1">
            <div
              className={`
                p-3 sm:p-6

                ${collapsible && expanded ? "row-start-1 row-span-1" : "row-start-1 row-span-2"}
                col-start-1 col-span-1
                refractor-highlight
                ${expanded ? "overflow-auto" : "max-h-[200px] overflow-hidden"}
              `}
            >
              <pre className={`transition ${expanded ? "" : "opacity-40"}`}>
                {!clientLoaded ? (
                  <code className="language language-tsx">{highlightedSource}</code>
                ) : (
                  <Editor
                    textareaClassName="simple-code-editor-textarea"
                    value={source}
                    onValueChange={(code) => setSource(code)}
                    highlight={(code) =>
                      toJsxRuntime(starryNight.highlight(code, scope), { Fragment, jsx, jsxs })
                    }
                  />
                )}
              </pre>
            </div>

            <div
              className={`
                sticky flex text-sm items-center justify-center gap-4 bottom-0 p-4
                ${collapsible && expanded ? "pt-0" : ""}
                row-start-2 row-span-1 col-start-1 col-span-1
                pointer-events-none
              `}
              aria-hidden="true"
            >
              {collapsible && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className={`
                bg-white text-black
                hover:bg-gray-200 focus:bg-gray-200
                font-semibold
                flex gap-2 items-center
                shadow-xl
                px-4 py-2 rounded-full
                pointer-events-auto
                `}
                >
                  <span>Show {expanded ? "less" : "all"}</span>
                  {expanded ? <MinusIcon /> : <PlusIcon />}
                </button>
              )}

              <div className="mx-auto" />

              <button
                type="button"
                onClick={() => openPlayground(source)}
                className="
                  flex gap-2 items-center  px-4 py-2 rounded-full
                  bg-slate-800 hover:bg-slate-700 focus:bg-slate-700
                  dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700
                  pointer-events-auto
                "
              >
                <StackBlitzIcon className="text-[#1389fd]" />
                <span>Edit in StackBlitz</span>
              </button>
            </div>
          </div>
        </div>
        <span aria-hidden={true} className="syntax-badge">
          TSX
        </span>
      </div>
    </div>
  )
}

async function openPlayground(source: string) {
  const functionName = source.match(/function ([A-z]+)/)?.[1]
  const prettier = await import("prettier/standalone")
  const typescriptParser = await import("prettier/plugins/typescript")
  const htmlParser = await import("prettier/plugins/html")
  const { default: prettierPluginEstree } = await import("prettier/plugins/estree")

  const tsx = await prettier.format(
    endent`
        ${source.includes("* as React") ? "" : 'import * as React from "react"'}
        import {createRoot} from "react-dom/client"

        import "mafs/core.css";
        import "mafs/font.css";

        ${source}

        createRoot(document.getElementById("root")).render(<${functionName} />)
      `,
    { parser: "typescript", plugins: [typescriptParser, prettierPluginEstree] },
  )

  const html = await prettier.format(
    endent`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <style>
            body {
              background: black;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>

        <body>
          <div id="root"></div>
        </body>
      </html>
    `,
    { parser: "html", plugins: [htmlParser] },
  )

  sdk.openProject({
    title: "Mafs Playground",
    description: "",
    template: "create-react-app",
    dependencies: {
      mafs: "latest",
      typescript: "4.9.4",
      react: ">=18",
      "react-dom": ">=18",
      "@types/react": "18.0.27",
      "@types/react-dom": "18.0.10",
      lodash: "4.17.21",
      "@types/lodash": "4.14.191",
    },
    files: {
      "src/index.tsx": tsx,
      "public/index.html": html,
    },
  })
}

export default CodeAndExample
