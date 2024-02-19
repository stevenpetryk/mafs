/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["mafs"],
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
