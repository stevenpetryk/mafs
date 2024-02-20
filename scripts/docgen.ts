import fg from "fast-glob"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

import docgen from "react-docgen-typescript"

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const tsConfigPath = path.join(projectRoot, "tsconfig.json")
const parse = docgen.withCustomConfig(tsConfigPath, {}).parseWithProgramProvider

export function writeDocgenResults(docgenInfo: docgen.ComponentDoc[]) {
  const writePath = path.join(projectRoot, "docs/generated-docgen.tsx")

  fs.writeFileSync(
    writePath,
    [
      `// prettier-ignore`,
      `const docgenInfo = ${JSON.stringify(docgenInfo, null, 2)} as const;`,
      `export default docgenInfo;`,
    ].join("\n") + "\n",
  )

  console.log(`Docgen updated ${writePath}`)
}

const paths = fg.sync("src/**/*.tsx")

const docgenInfo = parse(paths)
writeDocgenResults(docgenInfo)
