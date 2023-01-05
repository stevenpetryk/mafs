const ReactDocgenTypescriptPlugin = require("react-docgen-typescript-plugin").default
const path = require("path")

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["mafs"],
  webpack(config) {
    if (Number(process.env.DOCGEN) === 1) {
      config.plugins.push(
        new ReactDocgenTypescriptPlugin({
          tsConfigPath: path.join(__dirname, "../tsconfig.json"),
          include: [path.join(__dirname, "../src/**/*.tsx")],
          shouldRemoveUndefinedFromOptional: true,
        })
      )

      config.ignoreWarnings = [() => true]
    }

    return config
  },
}

module.exports = nextConfig
