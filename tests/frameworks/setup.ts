import { execSync } from "node:child_process"
import path from "node:path"
import fs from "fs-extra"

const ROOT = path.join(import.meta.dirname, "../..")

async function main() {
  execSync("git clean -fdx .", { cwd: path.join(ROOT, "tests/frameworks"), stdio: "inherit" })
  execSync("pnpm build", { cwd: ROOT, stdio: "inherit" })
  const tarball = execSync("npm pack", { cwd: ROOT, stdio: "pipe" })
  fs.moveSync(
    path.join(ROOT, tarball.toString().trim()),
    path.join(ROOT, "tests/frameworks/mafs.tgz"),
    { overwrite: true },
  )
  execSync("pnpm install", { cwd: path.join(ROOT, "tests/frameworks"), stdio: "inherit" })
  console.error(`Wrote ${path.join(ROOT, "tests/frameworks/mafs.tgz")} and installed`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
