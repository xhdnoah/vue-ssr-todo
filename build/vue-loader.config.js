module.exports = (isDev) => {
  return {
    preserveWhitespace: true,
    extractcss: !isDev,
    cssModules: {
      localIndexName: '[path]-[name]-[hash:base64:5]',
      camelCase: true
    }
    // hotReload: true // 根据环境变量生成
  }
}
