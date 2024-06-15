import fg from "fast-glob"
import { projectRoot, writeDocgenResults } from "./docgen"
import path from "node:path"

import * as docgen from "react-docgen-typescript"

const tsConfigPath = path.join(projectRoot, "tsconfig.json")
const parse = docgen.withCustomConfig(tsConfigPath, {
  shouldRemoveUndefinedFromOptional: true,
}).parseWithProgramProvider

const paths = fg.sync("src/**/*.tsx", { ignore: ["src/index.tsx"] })
const docgenInfo = parse(paths)
writeDocgenResults(docgenInfo)
