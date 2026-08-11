import * as esbuild from "esbuild"
import fs from "fs-extra"
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor"
import typescript from "typescript"
import invariant from "tiny-invariant"

const packageJson = fs.readJsonSync("./package.json")
const { exports, peerDependencies, dependencies } = packageJson
const { import: esmOutFile, require: cjsOutFile } = exports["."]

async function main() {
  fs.emptyDirSync("build")
  await runEsbuild()
  runTypeScript()
  runApiExtractor()
  fs.rmSync("build/types", { recursive: true })
}

function runEsbuild() {
  const sharedConfig: esbuild.BuildOptions = {
    entryPoints: ["src/index.tsx"],
    bundle: true,
    platform: "browser",
    // Keep published bundles usable in the browsers supported by the original
    // package instead of leaving proposal-only syntax to consumers.
    target: "es2019",
    sourcemap: true,
    // Keep the bundle small for consumers by letting their bundler minify.
    legalComments: "none",
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
  const result = program.emit()
  const diagnostics = typescript
    .getPreEmitDiagnostics(program)
    .concat(result.diagnostics)
    .filter((d) => d.category === typescript.DiagnosticCategory.Error)

  invariant(
    diagnostics.length === 0,
    `TypeScript declaration emit failed with ${diagnostics.length} error(s)`,
  )

  return result
}

function runApiExtractor() {
  const config = ExtractorConfig.loadFileAndPrepare("./api-extractor.json")
  invariant(config, "Could not load api-extractor.json")
  // Local builds automatically update the API report file.
  const result = Extractor.invoke(config, { localBuild: true })
  invariant(result.succeeded, "API Extractor failed")

  // API Extractor writes reports with CRLF line endings. Normalize the checked
  // in report so builds remain clean on Unix and Windows alike.
  const reportPath = "./.api-report/mafs.api.md"
  const report = fs.readFileSync(reportPath, "utf8")
  if (report.includes("\r\n")) fs.writeFileSync(reportPath, report.replaceAll("\r\n", "\n"))

  return result
}

main().catch((e) => {
  console.error("build failed", e)
  process.exit(1)
})
