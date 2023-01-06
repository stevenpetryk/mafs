import * as React from "react"
import * as ReactDOMServer from "react-dom/server"
import * as fs from "fs"
import * as path from "path"

import { Mafs, CartesianCoordinates } from ".."

const css = fs.readFileSync(path.join(process.cwd(), "core.css")).toString()

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

              .MafsView text {
                opacity: 0;
              }

              ${css}
            `,
          }}
        ></style>
      </head>

      <body>
        <Mafs ssr={true} width={500} height={500} viewBox={{ x: [0, 10], y: [0, 10] }} pan={false}>
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
