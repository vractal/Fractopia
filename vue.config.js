const publicPath = '/'

module.exports = {
  // options...
  publicPath: publicPath,

chainWebpack: config => {
  //http://kazupon.github.io/vue-i18n/guide/sfc.html#webpack
  config.module
  .rule("i18n")
  .resourceQuery(/blockType=i18n/)
  .type('javascript/auto')
  .use("i18n")
  .loader("@kazupon/vue-i18n-loader")
  .end();
}
}
