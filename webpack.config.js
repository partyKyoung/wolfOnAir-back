const webpack = require('webpack');
const path = require("path");
const slsw = require('serverless-webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  output: {
    libraryTarget: "commonjs",
    filename: "[name].js",
    path: path.resolve(__dirname, "build")
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      loader: ["ts-loader"],
      exclude: /node_modules/
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ],
  target: 'node',
  optimization: {
    minimize: false
  }
}