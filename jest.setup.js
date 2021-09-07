/* eslint-disable */
global.ResizeObserver = require("resize-observer-polyfill")

const { toMatchImageSnapshot } = require("jest-image-snapshot")
expect.extend({ toMatchImageSnapshot })
