const rules = require("./rules");
const plugins = require("./plugins");

module.exports = {
  entry: "./index.js",
  devtool: "source-map",
  module: {
    rules
  },
  plugins,
  devServer: {
    publicPath: "/assets",
    port: 8080,
    historyApiFallback: true
  }
};
