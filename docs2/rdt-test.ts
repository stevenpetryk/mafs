const path = require("path")
const docgen = require("react-docgen-typescript")

const parser = docgen.withCustomConfig("./tsconfig.json", {
  savePropValueAsString: true,
})

// Parse a file for docgen info
console.log(parser.parse(path.join(__dirname, "../src/display/Circle.tsx")))
