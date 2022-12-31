/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["mafs"],
}

module.exports = nextConfig
