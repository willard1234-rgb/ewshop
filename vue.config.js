module.exports = {
  // devServer: {
  // proxy: {
  //   '/api': {
  //     target: 'https://api.shop.eduwork.cn/',
  //     changeOrigin: true,
  //     ws: true,
  //     pathRewrite: {
  //       '^/api': ''
  //     }
  //   }
  // },
  // https: true
  // },
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'components': '@/components',
        'network': '@/network',
        'utils': '@/utils',
        'views': '@/views'
      }
    }
  }
}