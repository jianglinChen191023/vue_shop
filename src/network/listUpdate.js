// 获取商品分类列表数据
import { request } from './request'

export function getGoodsById (id) {
  return request({
    url: `/goods/${id}`
  })
}

export function updateGoods (id, data) {
  return request({
    url: `/goods/${id}`,
    method: 'put',
    data
  })
}
