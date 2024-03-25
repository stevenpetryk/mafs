import childProcess from "node:child_process"
import fs from "node:fs"

const shortCommit = childProcess.execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim()

const version = `0.0.0-${shortCommit}`

console.log(`Publishing ${version} to npm...`)

console.log("NPM_TOKEN", process.env.NPM_TOKEN?.length)

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
packageJson.version = version
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2))

fs.writeFileSync(".npmrc", "//registry.npmjs.org/:_authToken=${NPM_TOKEN}")

childProcess.execSync("pnpm build", { stdio: "inherit" })
childProcess.execSync("npm publish --ignore-scripts --access public --tag experimental", {
  stdio: "inherit",
  env: { ...process.env },
})
