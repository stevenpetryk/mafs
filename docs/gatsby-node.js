/* eslint-disable */
const path = require("path")
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin")

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig()

  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      alias: {
        "react-dom": "@hot-loader/react-dom",
        mafs: path.resolve(__dirname, "../src"),
      },
      fallback: {
        path: require.resolve("path-browserify"),
      },
    },
    plugins: [
      ...config.plugins,
      new MonacoWebpackPlugin({
        languages: ["typescript", "javascript", "css", "bash"],
      }),
    ],
  })
}
