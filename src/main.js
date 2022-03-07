import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/* 导入 element */
import './plugins/element'
/* 导入字体图标 */
import 'assets/fonts/iconfont.css'
import ZKTable from 'vue-table-with-tree-grid'

Vue.use(ZKTable)
// import { getLogin } from './network/login'
//
// console.log(getLogin('admin', '123456').then(data => {
//   console.log(data)
// }).catch(e => console.log(e))
// )
Vue.config.productionTip = false

// 全局时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
