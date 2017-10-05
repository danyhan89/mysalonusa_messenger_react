const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
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
