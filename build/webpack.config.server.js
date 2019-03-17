const path = require('path')
const ExtractPlugin = require('extract-text-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
// const nodeExternals = require('webpack-node-externals')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

const isDev = process.env.NODE_ENV === 'development'

let config

const plugins = [
  new ExtractPlugin({
    filename: 'styles.[Hash:8].css',
    allChunks: true
  }),
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': '"server"'
  })
]

if (isDev) {
  plugins.push(new VueServerPlugin())
}

config = merge(baseConfig, {
  target: 'node',
  entry: path.join(__dirname, '../client/server-entry.js'),
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server-entry.js',
    path: path.join(__dirname, '../server-build')
  },
  externals: Object.keys(require('../package.json').dependencies),
  module: {
    rules: [{
      test: /\.styl/,
      use: ExtractPlugin.extract({
        fallback: 'vue-style-loader',
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      })
    }]
  },
  // optimization: {
  //   splitChunks: undefined
  // },
  plugins
  // new webpack.LoaderOptionsPlugin({
  //   // test: /\.xxx$/, // may apply this only for some modules
  //   options: {
  //     chainWebpack: config => {
  //       config.module
  //         .rule('vue')
  //         .use('vue-loader')
  //         .tap(options =>
  //           merge(options, {
  //             optimizeSSR: false
  //           })
  //         )
  //     }
  //   }
  // })
})

config.resolve = {
  alias: {
    'model': path.join(__dirname, '../client/model/server-model.js')
  }
}
module.exports = config
