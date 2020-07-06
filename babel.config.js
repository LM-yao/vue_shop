// 这是项目发布阶段需要用到的 babel 插件
const prodPlugins = []
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  'presets': [
    '@vue/app'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    // 去除console，新增插件的配置项即可
    // 展开运算符，把数组里面的每一项展开放在另一个数组中
    // 发布产品时候的插件数组
    // 开发模式时是一个空数组
    ...prodPlugins,
    // 路由的懒加载
    '@babel/plugin-syntax-dynamic-import'
  ]
}
