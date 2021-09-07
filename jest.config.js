const tsJestPreset = require("ts-jest/jest-preset")
const puppeteerPreset = require("jest-puppeteer/jest-preset")

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...tsJestPreset,
  ...puppeteerPreset,
  setupFilesAfterEnv: [...puppeteerPreset.setupFilesAfterEnv, "./jest.setup.js"],
  globals: {
    "ts-jest": {
      babelConfig: {
        plugins: ["@babel/plugin-proposal-optional-chaining"],
      },
    },
  },
}
