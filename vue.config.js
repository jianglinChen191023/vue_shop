module.exports = {
  configureWebpack: {
    resolve: {
      /* 配置别名 */
      alias: {
        // '@': 'src', 已配置
        assets: '@/assets',
        common: '@/common',
        components: '@/components',
        network: '@/network'
      }
    }
  },
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap(args => {
        // 追加一个自定义属性 isProd
        args[0].isProd = true
        // 标题
        args[0].title = '电商后台管理系统'
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        // 追加一个自定义属性 isProd
        args[0].isProd = false
        // 标题
        args[0].title = 'dev - 电商后台管理系统'
        return args
      })
    })
  }
}
