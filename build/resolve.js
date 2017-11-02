const path = require("path");

module.exports = {
  alias: {
    "@app": path.resolve(__dirname, "../app_modules"),
    src: path.resolve(__dirname, "../src")
  }
};
