/* eslint-disable */
const path = require("path")

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      alias: {
        mafs: path.resolve(__dirname, "../src"),
        "react-dom": "@hot-loader/react-dom",
      },
    },
  })
}
