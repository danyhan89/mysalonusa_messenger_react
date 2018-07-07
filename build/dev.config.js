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
  output: {
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    publicPath: "/",
    port: 8080,
    historyApiFallback: true
  }
};
