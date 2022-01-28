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

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
