const puppeteerPreset = require("jest-puppeteer/jest-preset")

module.exports = {
  ...puppeteerPreset,
  setupFilesAfterEnv: [...puppeteerPreset.setupFilesAfterEnv, "./jest.setup.js"],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", { jsc: { transform: { react: { runtime: "automatic" } } } }],
  },
}
