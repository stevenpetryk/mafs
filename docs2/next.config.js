const path = require("path")

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  webpack: (config) => {
    // Ensure that the mafs src directory is compiled with the TS loader
    const tsRule = config.module.rules.find((rule) => rule.test.test(".ts"))
    tsRule.include.push(path.resolve(__dirname, "../src"))
    return config
  },
}
