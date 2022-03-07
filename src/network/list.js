import { request } from './request'

// 获取商品分类列表数据
export function getGoodsList (queryInfo) {
  return request({
    url: '/goods',
    params: queryInfo
  })
}

// 根据 Id 删除商品
export function deleteGoodsById (id) {
  return request({
    url: `/goods/${id}`,
    method: 'delete'
  })
}
