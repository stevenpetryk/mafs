const path = require("path")

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  webpack: (config) => {
    // Ensure that the mafs src directory is compiled with the TS loader
    const tsRule = config.module.rules.find((rule) => rule.test.test(".ts"))
    tsRule.include.push(path.resolve(__dirname, "../src"))
    config.resolve.modules = [
      ...config.resolve.modules,
      path.resolve(__dirname, "src"),
      "node_modules",
    ]

    return config
  },
}
