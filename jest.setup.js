/* eslint-disable */
global.ResizeObserver = require("resize-observer-polyfill")

const { toMatchImageSnapshot, configureToMatchImageSnapshot } = require("jest-image-snapshot")
expect.extend({ toMatchImageSnapshot })

configureToMatchImageSnapshot({
  comparisonMethod: "ssim",
  failureThreshold: 0.01,
})
