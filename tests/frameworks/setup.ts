import { execSync } from "node:child_process"
import path from "node:path"
import fs from "fs-extra"

const ROOT = path.join(import.meta.dirname, "../..")

function resetFrameworksDir() {
  try {
    execSync("git clean -fdx .", { cwd: path.join(ROOT, "tests/frameworks"), stdio: "inherit" })
    return
  } catch (error) {
    if (process.env.CI) throw error
    console.warn("git unavailable; removing generated framework files manually")
  }
  for (const dir of ["node_modules", ".next", "dist", ".svelte-kit"]) {
    fs.rmSync(path.join(ROOT, "tests/frameworks", dir), { recursive: true, force: true })
  }
  for (const file of ["pnpm-lock.yaml", "package-lock.json", "mafs.tgz"]) {
    fs.rmSync(path.join(ROOT, "tests/frameworks", file), { force: true })
  }
}

async function main() {
  resetFrameworksDir()
  execSync("pnpm build", { cwd: ROOT, stdio: "inherit" })
  const tarball = execSync("npm pack --silent", { cwd: ROOT, stdio: "pipe" })
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
