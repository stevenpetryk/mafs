/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["mafs"],

  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      include: /guide-examples/,
      use: require.resolve("./guide-example-loader.mjs"),
    })

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
