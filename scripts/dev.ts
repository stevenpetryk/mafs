import path from "node:path"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"

import ts from "typescript"
import * as docgen from "react-docgen-typescript"

import { writeDocgenResults } from "./docgen"

const dirname = path.join(fileURLToPath(import.meta.url), "..")
const projectRoot = path.join(dirname, "..")
const srcRoot = path.join(projectRoot, "src")
const docsRoot = path.join(projectRoot, "docs")

const tsconfig = path.join(projectRoot, "tsconfig.json")
const customDocgen = docgen.withCustomConfig(tsconfig, { shouldRemoveUndefinedFromOptional: true })
const parse = customDocgen.parseWithProgramProvider

function startTSDocgen() {
  const configPath = ts.findConfigFile(tsconfig, ts.sys.fileExists, "tsconfig.json")
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.")
  }

  const createProgram = ts.createSemanticDiagnosticsBuilderProgram

  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    createProgram,
    () => {},
    () => {},
  )

  const origPostProgramCreate = host.afterProgramCreate

  host.afterProgramCreate = (program) => {
    const programFiles = program
      .getSourceFiles()
      .map((sf) => sf.fileName)
      .filter((f) => f.startsWith(srcRoot) && !f.includes("src/index.tsx"))

    const docgenInfo = parse(programFiles, () => program.getProgram())
    writeDocgenResults(docgenInfo)
    origPostProgramCreate?.(program)
  }

  return ts.createWatchProgram(host)
}

function main() {
  const watch = startTSDocgen()
  const next = spawn("node_modules/.bin/next", ["dev"], { stdio: "inherit", cwd: docsRoot })

  process.on("SIGINT", () => {
    watch.close()
    next.kill()
  })

  next.on("exit", (code) => {
    watch.close()
    process.exit(code ?? 1)
  })
}

main()
