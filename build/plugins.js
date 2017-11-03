const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  new webpack.DefinePlugin({
    "process.env": {
      SERVER_URL: JSON.stringify(process.env.SERVER_URL || "localhost:3000")
    }
  }),
  new ExtractTextPlugin("bundle.[hash].css"),
  new HtmlWebpackPlugin({
    filename: "index.html", //output html file
    template: "prod.html",
    minify: {
      minifyJS: false,
      minifyCSS: false,
      collapseWhitespace: true
    }
  })
];
