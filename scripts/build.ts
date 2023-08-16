import * as esbuild from "esbuild"
import fs from "fs-extra"
import { Extractor } from "@microsoft/api-extractor"
import typescript from "typescript"
import invariant from "tiny-invariant"

const packageJson = fs.readJsonSync("./package.json")
const { main: cjsOutFile, module: esmOutFile, peerDependencies, dependencies } = packageJson

async function main() {
  fs.emptyDirSync("build")
  await runEsbuild()
  runTypeScript()
  runApiExtractor()
  fs.rm("build/types", { recursive: true })
}

function runEsbuild() {
  const sharedConfig: esbuild.BuildOptions = {
    entryPoints: ["src/index.tsx"],
    bundle: true,
    platform: "browser",
    sourcemap: true,
    external: Object.keys({ ...peerDependencies, ...dependencies }),
  }

  return Promise.all([
    esbuild.build({ ...sharedConfig, format: "esm", outfile: esmOutFile }).then((r) => {
      console.log(`Wrote ${esmOutFile}`)
      return r
    }),
    esbuild.build({ ...sharedConfig, format: "cjs", outfile: cjsOutFile }).then((r) => {
      console.log(`Wrote ${cjsOutFile}`)
      return r
    }),
  ])
}

function runTypeScript() {
  const tsConfig = typescript.readConfigFile("./tsconfig.json", typescript.sys.readFile)
  const tsConfigParseResult = typescript.parseJsonConfigFileContent(
    tsConfig.config,
    typescript.sys,
    "./",
  )
  const program = typescript.createProgram(
    tsConfigParseResult.fileNames,
    tsConfigParseResult.options,
  )
  return program.emit()
}

function runApiExtractor() {
  const result = Extractor.loadConfigAndInvoke("./api-extractor.json")
  invariant(result.succeeded, "API Extractor failed")
  return result
}

main().catch((e) => {
  console.error("build failed", e)
  process.exit(1)
})
