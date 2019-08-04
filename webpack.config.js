const path = require("path");
const slsw = require('serverless-webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: path.join(__dirname, "src/server.ts"),
  output: {
    libraryTarget: "commonjs",
    filename: "[name].js",
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
  },
  target: 'node',
}