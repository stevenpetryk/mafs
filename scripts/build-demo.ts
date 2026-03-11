import * as esbuild from "esbuild"

async function main() {
  await esbuild.build({
    entryPoints: ["demo/demo-entry.tsx"],
    bundle: true,
    format: "esm",
    outfile: "demo/demo-bundle.js",
    platform: "browser",
    sourcemap: true,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    loader: {
      ".tsx": "tsx",
      ".ts": "ts",
    },
  })
  console.log("Demo built successfully → demo/demo-bundle.js")
}

main().catch((e) => {
  console.error("Demo build failed:", e)
  process.exit(1)
})
