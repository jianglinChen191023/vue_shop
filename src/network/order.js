import { request } from './request'

// 获取订单列表数据
export function getOrderList (queryInfo) {
  return request({
    url: '/orders',
    params: queryInfo
  })
}

// 修改订单信息
export function updateOrder (id, data) {
  return request({
    url: `/orders/${id}`,
    method: 'put',
    data
  })
}

// 获取物流进度
export function getKuaidiById (id) {
  return request({
    url: `/kuaidi/${id}`
  })
}
