const esbuild = require("esbuild")
const { nodeExternalsPlugin } = require("esbuild-node-externals")

esbuild.build({
  entryPoints: ["src/index.tsx", "src/index.css"],
  bundle: true,
  minify: true,
  sourcemap: false,
  outdir: "build",
  logLevel: "info",
  watch: process.env.WATCH === "true",
  plugins: [nodeExternalsPlugin()],
})
