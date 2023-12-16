const ReactDocgenTypescriptPlugin = require("react-docgen-typescript-plugin").default
const path = require("path")

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["mafs"],
  webpack(config) {
    if (process.env.NODE_ENV === "production" || Number(process.env.DOCGEN) === 1) {
      config.plugins.push(
        new ReactDocgenTypescriptPlugin({
          tsConfigPath: path.join(__dirname, "../tsconfig.json"),
          include: [path.join(__dirname, "../src/**/*.tsx")],
          shouldRemoveUndefinedFromOptional: true,
        }),
      )

      config.ignoreWarnings = [() => true]
    }

    return config
  },
  async redirects() {
    return [
      {
        source: "/guides/display/graphs",
        destination: "/guides/display/plots",
        permanent: false,
      },
      {
        source: "/guides/display/vector-fields",
        destination: "/guides/display/plots",
        permanent: false,
      },
      {
        source: "/guides/utility/transform",
        destination: "/guides/display/transform",
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
