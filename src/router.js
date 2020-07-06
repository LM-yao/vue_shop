import Vue from 'vue'
import Router from 'vue-router'
// // 导入登陆组件
// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'
// import Users from './components/user/Users.vue'
// // 组件通过路由的形式加载
// import Rights from './components/power/Rights.vue'
// import Roles from './components/power/Roles.vue'
// import Cate from './components/goods/Cate.vue'
// import Params from './components/goods/Params.vue'
// import GoodsList from './components/goods/List.vue'
// import Add from './components/goods/Add.vue'
// import Order from './components/order/Order.vue'
// import Report from './components/report/Report.vue'
// 路由懒加载
const Login = () => import(/*webpackChunkName:"login_home_welcome" */ './components/Login.vue')
const Home = () => import(/*webpackChunkName:"login_home_welcome" */ './components/Home.vue')
const Welcome = () => import(/*webpackChunkName:"login_home_welcome" */ './components/Welcome.vue')

const Users = () => import(/*webpackChunkName:"Users_Rights_Roles" */ './components/user/Users.vue')
const Rights = () => import(/*webpackChunkName:"Users_Rights_Roles" */ './components/power/Rights.vue')
const Roles = () => import(/*webpackChunkName:"Users_Rights_Roles" */ './components/power/Roles.vue')

const Cate = () => import(/*webpackChunkName:"Cate_Params" */ './components/goods/Cate.vue')
const Params = () => import(/*webpackChunkName:"Cate_Params" */ './components/goods/Params.vue')

const GoodsList = () => import(/*webpackChunkName:"GoodsList_Add" */ './components/goods/List.vue')
const Add = () => import(/*webpackChunkName:"GoodsList_Add" */ './components/goods/Add.vue')

const Order = () => import(/*webpackChunkName:"Order_Report" */ './components/order/Order.vue')
const Report = () => import(/*webpackChunkName:"Order_Report" */ './components/report/Report.vue')


Vue.use(Router)

const router = new Router({
  routes: [
    // 路由重定向，用户访问根路径‘/’，则重定向到Login页面
    { path: '/', redirect: '/login' },
    // 当用户访问login时使用component展示Login页面
    { path: '/login', component: Login },
    {
      // 加入路由规则
      path: '/home',
      component: Home,
      // 重定向
      redirect: '/welcome',
      // 子路由
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
// 如果用户没有登陆，但是直接通过URL访问特定页面，需要重新导航到登陆页面
// 挂载路由导航守卫，beforeEach接收一个回调函数
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
