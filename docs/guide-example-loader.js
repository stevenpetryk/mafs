const path = require("node:path")

module.exports = function guideExampleLoader(source) {
  // const filename = path.basename(this.resourcePath, path.extname(this.resourcePath))

  return `
    ${source}
    ; export const sourceCode = ${JSON.stringify(source)};
  `
}
