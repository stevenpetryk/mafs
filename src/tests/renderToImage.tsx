import React from "react"
import ReactDOMServer from "react-dom/server"
import fs from "fs"
import path from "path"

import { Mafs, CartesianCoordinates } from ".."

const css = fs.readFileSync(path.join(process.cwd(), "src/index.css")).toString()

export default async function renderToImage(
  children: React.ReactChild,
  { coordinates = true } = {}
): Promise<Buffer | string | void> {
  const output = ReactDOMServer.renderToString(
    <>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              ${css}
            `,
          }}
        ></style>
      </head>

      <body>
        <Mafs
          ssr={true}
          width={500}
          height={500}
          xAxisExtent={[-0.5, 10.5]}
          yAxisExtent={[-0.5, 10.5]}
          pan={false}
        >
          {coordinates ? <CartesianCoordinates /> : null}
          {children}
        </Mafs>
      </body>
    </>
  )

  await page.setContent(output)
  await page.evaluateHandle("document.fonts.ready")
  return await page.screenshot()
}
