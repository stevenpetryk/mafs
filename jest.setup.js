/* eslint-disable */
global.ResizeObserver = require("resize-observer-polyfill")

const { toMatchImageSnapshot, configureToMatchImageSnapshot } = require("jest-image-snapshot")
expect.extend({ toMatchImageSnapshot })

configureToMatchImageSnapshot({
  failureThreshold: 0.005,
  failureThresholdType: "percent",
})
