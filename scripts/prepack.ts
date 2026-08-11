import { execFileSync } from "node:child_process"

// npm pack uses stdout for the generated archive filename. Keep the mandatory
// publish build quiet there while preserving build failures on stderr.
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm"
execFileSync(pnpm, ["build"], { stdio: ["ignore", "ignore", "inherit"] })
