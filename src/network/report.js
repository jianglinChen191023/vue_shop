import { request } from './request'

// 获取数据报表
export function getReport () {
  return request({
    url: '/reports/type/1'
  })
}
