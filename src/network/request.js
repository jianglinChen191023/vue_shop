import axios from 'axios'
import store from '../store'

// 三次优化
export function request (config) {
  // 1. 创建 axios 的实例
  const instance = axios.create({
    baseURL: 'https://lianghj.top:8888/api/private/v1',
    timeout: 5000
  })

  // 2. axios 的拦截器
  // 配置请求和响应拦截
  instance.interceptors.request.use(config => {
    // 1. 比如 config 中一些信息不符合服务器的要求
    // 2. 比如每次发送网络请求时, 都希望在界面中显示一个请求的图标
    // console.log('来到了 request 拦截 success 中')
    // 添加请求头的 token 信息
    config.headers.authorization = store.getters.token
    return config
  }, err => {
    // console.log('来到了 request 拦截 failure 中')
  })

  // 响应拦截
  instance.interceptors.response.use(res => {
    // console.log('来到了 response 拦截 success 中')
    return res.data
  }, err => {
    // console.log('来到了 response 拦截 failure 中')
  })

  // 3. 发送真正的网络请求
  return instance(config)
}
