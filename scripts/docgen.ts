import docgen from "react-docgen-typescript"
import fg from "fast-glob"
import fs from "node:fs"
import path from "path"
import { fileURLToPath } from "url"

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const tsConfigPath = path.join(projectRoot, "tsconfig.json")
const parse = docgen.withCustomConfig(tsConfigPath, {}).parseWithProgramProvider

const paths = fg.sync("src/**/*.tsx")

const docgenInfo = parse(paths)

const writePath = path.join(projectRoot, "docs/generated-docgen.tsx")

const contents = `
// prettier-ignore
const docgenInfo = ${JSON.stringify(docgenInfo, null, 2)} as const;
export default docgenInfo;
`

fs.writeFileSync(writePath, contents)
console.log(`Wrote docgen info to ${writePath}`)
