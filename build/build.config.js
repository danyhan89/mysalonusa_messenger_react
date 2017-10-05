const path = require("path");
const rules = require("./rules");
const plugins = require("./plugins");

module.exports = {
  entry: "./index.js",
  devtool: "source-map",
  module: {
    rules
  },
  plugins,
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.[hash].js"
  }
};
