// 自定义webpack配置项,修改默认打包入口
module.exports={
    // 指向的值是一个function
    // 发布模式
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production',config => {
            // 将默认的情况，在追加设置的
            config.entry('app').clear().add('./src/main-prod.js')
            config.set('externals',{
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })
            // 根据isProd渲染首页
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        // 开发模式
        config.when(process.env.NODE_ENV === 'development',config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }

}