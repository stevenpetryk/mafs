import { execSync } from "node:child_process"
import path from "node:path"
import fs from "fs-extra"

const ROOT = path.join(import.meta.dirname, "../..")

async function main() {
  execSync("pnpm build", { cwd: ROOT, stdio: "pipe" })
  const tarball = execSync("npm pack", { cwd: ROOT, stdio: "pipe" })
  fs.moveSync(
    path.join(ROOT, tarball.toString().trim()),
    path.join(ROOT, "tests/frameworks/mafs.tgz"),
    { overwrite: true },
  )
  console.error(`Wrote ${path.join(ROOT, "tests/frameworks/mafs.tgz")}`)
  execSync("pnpm install", { cwd: path.join(ROOT, "tests/frameworks"), stdio: "pipe" })
  console.error(`Set up ${path.join(ROOT, "tests/frameworks")}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
