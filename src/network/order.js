import { request } from './request'

// 获取订单列表数据
export function getOrderList (queryInfo) {
  return request({
    url: '/orders',
    params: queryInfo
  })
}
