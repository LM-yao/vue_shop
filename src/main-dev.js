import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入树形插件
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入NProgress包对应的JS（实现效果）和CSS（美化进度条）安装依赖
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置axios
import axios from 'axios'
// 配置请求的根路径，api接口文档
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request拦截器中，展示进度条NProgress.start()
// axios请求拦截
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start()
  // 为请求头对象，添加token验证的Authorization字段，有权限的API可以正常使用
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// 在response拦截器中，隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 将axios挂载在vue的原型对象上，每个vue的组件可以通过this直接访问到$http，从而发起ajax请求
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 树形插件
Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
// 注册一个全局的时间过滤器，dateFormat过滤器的名字，function为过滤器的处理函数，originVal为需要处理的时间数据，形参
Vue.filter('dateFormat', function(originVal) {
  // 根据给定的时间创建一个时间对象
  const dt = new Date(originVal)
  // 拿到完整是四位的年份，以及月分（从0开始），不足两位前边补0
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  // 得到时分秒
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // 拼接成一个字符串，返回模板字符串，yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
