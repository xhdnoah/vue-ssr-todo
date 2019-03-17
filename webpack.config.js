const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.jsx$/,
      loader: 'babel-loader'
    }, {
      test: /\.(gif|jpg|jpeg|svg)$/,
      use: [{
        loader: 'url-loader',
        // loader 配置项
        options: {
          // 图片 size<1024kb 直接转为base64代码
          limit: 1024,
          // 输出name，ext:图片扩展名
          name: '[name]-aaa.[ext]'
        }
      }]
    }]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      // 帮助 webpack 编译过程以及在页面 js 脚本中判断运行环境
      'process.env': {
        // development production 加双引号
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new VueLoaderPlugin(),
    new HTMLPlugin()
  ]
}

if (isDev) {
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue']
  }
  config.module.rules.push({
    test: /\.styl/,
    use: [
      // stylus 预处理输出 css 抛给 css-loader 处理，再抛给 style-loader
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        // 当已经有处理器生成了 sourceMap(stylus-loader)，可以直接拿来使用
        options: {
          sourceMap: true
        }
      },
      'stylus-loader'
    ]
  })
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    port: 8000,
    // 设置 ’0.0.0.0‘ 则即可通过 127.0.0.1 访问，也可以通过内网 ip 或外网 ip 访问
    // 在服务器中，0.0.0.0 指的是本机上的所有 IPV4 地址
    host: '0.0.0.0',
    // overlay 将报错直接显示在网页中
    overlay: {
      errors: true
    },
    hot: true
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push({
    test: /\.styl/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
      'stylus-loader'
    ]
  })

  config.plugins.push(
    // 文件名根据 css 文件内容进行哈希
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  )
}

module.exports = config
