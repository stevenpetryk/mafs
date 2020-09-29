// @ts-check

const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const WithoutFilesPlugin = require("./WithoutFilesPlugin")
const nodeExternals = require("webpack-node-externals")
const ShellPlugin = require("webpack-shell-plugin")

const mode = process.env.NODE_ENV === "production" ? "production" : "development"

// Remove pesky .css.js files from the build

/** @type {import('webpack').Configuration} */
module.exports = {
  mode,
  entry: {
    index: "./src/index.tsx",
    "index.css": "./src/index.css",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    // @ts-ignore (ironically)
    plugins: [new TsconfigPathsPlugin()],
  },
  devtool: mode === "production" ? false : "eval-cheap-source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
    library: "",
    libraryTarget: "commonjs",
  },
  externals: [
    nodeExternals({
      allowlist: [/^lodash\./],
    }),
  ],
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]",
    }),
    new WithoutFilesPlugin([/\.css\.js(\.map)?$/]),
    new ShellPlugin({ onBuildEnd: ["./prepublish.sh"] }),
  ],
}
