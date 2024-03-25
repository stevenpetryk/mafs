import childProcess from "node:child_process"
import fs from "node:fs"

const shortCommit = childProcess.execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim()

const version = `0.0.0-${shortCommit}`

console.log(`Publishing ${version} to npm...`)

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
packageJson.version = version
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2))

childProcess.execSync("pnpm build", { stdio: "inherit" })
childProcess.execSync("npm publish --ignore-scripts --access public --tag experimental", {
  stdio: "inherit",
  env: { ...process.env },
})
