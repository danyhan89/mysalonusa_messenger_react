const ExtractTextPlugin = require("extract-text-webpack-plugin");

const dev = process.env.NODE_ENV !== "production";

const compileStyles = loaders =>
  dev
    ? loaders
    : ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: loaders.slice(1)
      });

module.exports = [
  { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ },
  { test: /\.css$/, use: compileStyles(["style-loader", "css-loader"]) },
  {
    test: /\.scss$/,
    use: compileStyles(["style-loader", "css-loader", "sass-loader"])
  }
];
