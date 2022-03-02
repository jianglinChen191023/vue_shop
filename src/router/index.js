import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

const Login = () => import('../views/login/Login.vue')
const Home = () => import('../views/home/Home.vue')
const Welcome = () => import('../views/welcome/Welcome.vue')
const Users = () => import('../views/user/Users.vue')
const Rights = () => import('../views/power/Rights.vue')
const Roles = () => import('../views/power/Roles.vue')
const Cate = () => import('../views/goods/Cate.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    // redirect: '/welcome',
    redirect () {
      return store.getters.activePath
    },
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 使用前置导航守卫控制访问权限
router.beforeEach((to, from, next) => {
  // ● to: Route: 即将要进入的目标 路由对象
  // ● from: Route: 当前导航正要离开的 路由对象
  // ● next('/login') 跳转页面
  // 如果用户访问的登录页, 直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取保存的 token 值
  const tokenStr = store.getters.token

  // 没有 token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
