const path = require("path");

module.exports = {
  entry: path.join(__dirname, "src/server.ts"),
  output: {
    libraryTarget: "commonjs",
    filename: "src/server.js",
    path: path.resolve(__dirname, "build")
  },
  module: {
    rules: [{
      test: /.tsx?$/,
      loader: "ts-loader",
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
}