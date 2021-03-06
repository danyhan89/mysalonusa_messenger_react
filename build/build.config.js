const path = require("path");
const rules = require("./rules");
const plugins = require("./plugins");
const resolve = require("./resolve");

module.exports = {
  entry: "./index.js",
  devtool: "source-map",
  module: {
    rules
  },
  resolve,
  plugins,
  // optimization,
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.[hash].js",
    chunkFilename: "[hash].[id].chunk.js"
  }
};
