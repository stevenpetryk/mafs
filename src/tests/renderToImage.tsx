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
      <style>{`
        body { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-family: "Arial", sans-serif;
        }
      `}</style>
      <style>{css}</style>

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
    </>
  )

  await page.setContent(output)
  return await page.screenshot()
}
