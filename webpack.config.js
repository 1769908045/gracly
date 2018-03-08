const {resolve} = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    bundle: resolve(__dirname, './main')
  },
  output: {
    path: resolve(__dirname, './'),
    filename: "[name].js?"
  },
  devtool: "source-map"
}